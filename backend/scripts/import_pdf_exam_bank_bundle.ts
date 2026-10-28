#!/usr/bin/env node

/**
 * Upload and import a generated PDF exam-bank bundle. All catalog and asset
 * validation runs before the first write. Release activation requires an
 * explicit --activate in addition to --apply. The command never deletes or
 * overwrites an object.
 */
import { createReadStream } from 'node:fs';
import { access, readFile, realpath, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { isAbsolute, join, resolve, sep } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Client } from 'minio';
import { CurriculumModule } from '../src/curriculum/curriculum.module';
import { CurriculumService } from '../src/curriculum/curriculum.service';
import {
  CurriculumRelease,
  CurriculumTask,
  CurriculumTopic,
  ExamTrack,
} from '../src/curriculum/entities/curriculum.entity';
import { CurriculumImportPayload } from '../src/curriculum/curriculum.types';

export type SupportedExamTrack = ExamTrack.EGE_BASE | ExamTrack.EGE_PROFILE;

export interface BundleImportOptions {
  bundleDir: string;
  tracks: SupportedExamTrack[];
  apply: boolean;
  activate?: boolean;
}

export interface ExistingRelease {
  id: string;
  importHash?: string;
  isActive: boolean;
}

export interface CatalogImportAdapter {
  preview(payload: CurriculumImportPayload): {
    hash: string;
    stats: { topics: number; tasks: number; taskTypes: number; tasksWithoutAnswers: number };
    warnings: string[];
  };
  findRelease(input: {
    examTrack: ExamTrack;
    year: number;
    version: string;
  }): Promise<ExistingRelease | undefined>;
  importPayload(payload: CurriculumImportPayload, dryRun: boolean): Promise<{
    releaseId?: string;
    idempotent?: boolean;
    topicCount?: number;
    taskCount?: number;
    warnings?: string[];
  }>;
  activate?(releaseId: string): Promise<void>;
}

export interface AssetRecord {
  key: string;
  path: string;
  size: number;
  sha256: string;
}

export interface ObjectFingerprint {
  size: number;
  sha256: string;
}

export interface BundleAssetStorage {
  bucketExists(): Promise<boolean>;
  fingerprint(key: string): Promise<ObjectFingerprint | undefined>;
  putFile(asset: AssetRecord): Promise<void>;
}

export interface BundleImportDependencies {
  db: CatalogImportAdapter;
  storage: BundleAssetStorage;
}

interface ValidatedAsset extends AssetRecord {
  track: SupportedExamTrack;
}

interface PreparedCatalog {
  payload: CurriculumImportPayload;
  track: SupportedExamTrack;
  stats: {
    topics: number;
    tasks: number;
    taskTypes: number;
    tasksWithoutAnswers: number;
  };
  warnings: string[];
  existing?: ExistingRelease;
  assets: ValidatedAsset[];
}

export interface BundleImportReport {
  mode: 'dry-run' | 'applied';
  releases: Array<{
    track: SupportedExamTrack;
    version: string;
    tasks: number;
    topics: number;
    imageCount: number;
    missingAssets: number;
    uploadCount: number;
    existingObjectCount: number;
    idempotent: boolean;
    active: boolean;
    releaseId?: string;
    activated: boolean;
    warnings: string[];
  }>;
}

const SHA256_RE = /^[a-f0-9]{64}$/i;
const TASK_ID_RE = /^\d+(?:\.\d+){1,2}$/;

function bundleConfiguration() {
  const required = (name: string) => {
    const value = process.env[name]?.trim();
    if (!value) throw new Error(`Для импорта требуется переменная ${name}.`);
    return value;
  };
  const port = (name: string, fallback: number) => {
    const value = Number(process.env[name] || fallback);
    if (!Number.isInteger(value) || value < 1 || value > 65535) {
      throw new Error(`${name} должен быть целым TCP-портом.`);
    }
    return value;
  };
  return {
    database: {
      host: required('DATABASE_HOST'),
      port: port('DATABASE_PORT', 5433),
      user: required('DATABASE_USER'),
      password: required('DATABASE_PASSWORD'),
      name: required('DATABASE_NAME'),
    },
    storage: {
      endPoint: required('MINIO_ENDPOINT'),
      port: port('MINIO_PORT', 9010),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: required('MINIO_ACCESS_KEY'),
      secretKey: required('MINIO_SECRET_KEY'),
      bucket: required('MINIO_BUCKET'),
      region: process.env.MINIO_REGION || 'us-east-1',
    },
  };
}

export async function importExamBankBundle(
  options: BundleImportOptions,
  dependencies: BundleImportDependencies,
): Promise<BundleImportReport> {
  if (!options.bundleDir) throw new Error('Укажите каталог bundle через --bundle.');
  if (!options.tracks.length) throw new Error('Выберите хотя бы один трек.');
  if (options.activate && !options.apply) {
    throw new Error('--activate требует явного --apply.');
  }
  if (new Set(options.tracks).size !== options.tracks.length) {
    throw new Error('Трек указан несколько раз.');
  }

  const bundleRoot = resolve(options.bundleDir);
  const prepared: PreparedCatalog[] = [];
  const allKeys = new Set<string>();

  // Read, validate, hash, and preview every selected release before remote I/O.
  for (const track of options.tracks) {
    const catalogPath = join(bundleRoot, `${track}.json`);
    const payload = JSON.parse(await readFile(catalogPath, 'utf8')) as CurriculumImportPayload;
    const catalog = validateCatalog(payload, track);
    const preview = dependencies.db.preview(payload);
    const existing = await dependencies.db.findRelease({
      examTrack: payload.examTrack,
      year: payload.year,
      version: payload.version,
    });

    if (existing && existing.importHash !== preview.hash) {
      throw new Error(
        `Версия ${track}/${payload.version} уже существует с другим содержимым; загрузка отменена.`,
      );
    }
    if (existing?.isActive) {
      throw new Error(
        `Версия ${track}/${payload.version} уже активна; этот импортёр работает только с неактивными релизами.`,
      );
    }

    const assets: ValidatedAsset[] = [];
    for (const task of payload.tasks) {
      const imageKeys = task.metadata?.imageKeys;
      if (!Array.isArray(imageKeys) || imageKeys.length === 0) {
        throw new Error(`У задания ${task.externalId} нет imageKeys.`);
      }
      for (const [imageIndex, key] of imageKeys.entries()) {
        validateObjectKey(key, track, catalog.sourceSha256);
        if (!key.endsWith(`/${task.externalId}/${imageIndex}.webp`)) {
          throw new Error(
            `Object key не соответствует заданию ${task.externalId} и индексу фрагмента ${imageIndex}: ${key}`,
          );
        }
        if (allKeys.has(key)) {
          throw new Error(`Ключ изображения используется повторно: ${key}`);
        }
        allKeys.add(key);
        const imagePath = resolve(bundleRoot, 'images', ...key.split('/'));
        const imageRoot = await realpath(resolve(bundleRoot, 'images'));
        const path = await realpath(imagePath);
        if (!path.startsWith(`${imageRoot}${sep}`)) {
          throw new Error(`Путь изображения выходит за каталог bundle: ${key}`);
        }
        const asset = await validateLocalWebp(path, key, track);
        assets.push(asset);
      }
    }

    prepared.push({
      payload,
      track,
      stats: preview.stats,
      warnings: preview.warnings,
      existing,
      assets,
    });
  }

  if (!(await dependencies.storage.bucketExists())) {
    throw new Error('MinIO bucket не найден. Импорт остановлен без изменений.');
  }

  // Verify every existing object fully before uploading any missing object.
  const missingByKey = new Set<string>();
  const existingByTrack = new Map<SupportedExamTrack, number>();
  const assetsWithCatalog = prepared.flatMap((catalog) =>
    catalog.assets.map((asset) => ({ catalog, asset })),
  );
  const fingerprints = await mapBounded(
    assetsWithCatalog,
    8,
    ({ asset }) => dependencies.storage.fingerprint(asset.key),
  );
  for (let index = 0; index < assetsWithCatalog.length; index += 1) {
    const { catalog, asset } = assetsWithCatalog[index];
    const remote = fingerprints[index];
    if (!remote) {
      missingByKey.add(asset.key);
      continue;
    }
    if (remote.size !== asset.size || remote.sha256 !== asset.sha256) {
      throw new Error(
        `Объект не совпадает с bundle по content-addressed key: ${asset.key}`,
      );
    }
    existingByTrack.set(
      catalog.track,
      (existingByTrack.get(catalog.track) ?? 0) + 1,
    );
  }

  const report: BundleImportReport = {
    mode: options.apply ? 'applied' : 'dry-run',
    releases: [],
  };

  for (const catalog of prepared) {
    const missing = catalog.assets.filter((asset) => missingByKey.has(asset.key));
    let result: Awaited<ReturnType<CatalogImportAdapter['importPayload']>> | undefined;
    let uploadedCount = 0;
    if (options.apply) {
      uploadedCount = await uploadAssetsBounded(missing, dependencies.storage, 8);
      // CurriculumService.importPayload is transactional and always creates an inactive release.
      result = await dependencies.db.importPayload(catalog.payload, false);
      const persisted = await dependencies.db.findRelease({
        examTrack: catalog.payload.examTrack,
        year: catalog.payload.year,
        version: catalog.payload.version,
      });
      if (!persisted || persisted.isActive) {
        throw new Error(
          `Импорт ${catalog.track} не подтвердил наличие неактивной версии. Проверьте состояние каталога.`,
        );
      }
    }

    report.releases.push({
      track: catalog.track,
      version: catalog.payload.version,
      tasks: catalog.stats.tasks,
      topics: catalog.stats.topics,
      imageCount: catalog.assets.length,
      missingAssets: missing.length,
      uploadCount: uploadedCount,
      existingObjectCount: existingByTrack.get(catalog.track) ?? 0,
      idempotent: result?.idempotent ?? Boolean(catalog.existing),
      active: catalog.existing?.isActive ?? false,
      releaseId: result?.releaseId ?? catalog.existing?.id,
      activated: false,
      warnings: catalog.warnings,
    });
  }

  if (options.activate) {
    if (!dependencies.db.activate) {
      throw new Error('Активация недоступна в выбранном адаптере.');
    }
    // Only after all selected catalogs were uploaded, imported, and verified
    // inactive do we perform this separate, explicit release action.
    for (const item of report.releases) {
      if (!item.releaseId) throw new Error(`Не найден releaseId для ${item.track}.`);
      await dependencies.db.activate(item.releaseId);
      item.activated = true;
      item.active = true;
    }
  }

  return report;
}

async function uploadAssetsBounded(
  assets: AssetRecord[],
  storage: BundleAssetStorage,
  concurrency: number,
): Promise<number> {
  let nextIndex = 0;
  let firstError: unknown;
  let uploaded = 0;
  const worker = async () => {
    while (firstError === undefined) {
      const current = nextIndex;
      nextIndex += 1;
      if (current >= assets.length) return;
      const asset = assets[current];
      try {
        // Recheck the digest immediately before each write; a changed mounted
        // bundle must never be uploaded under an old content-addressed key.
        if ((await hashFile(asset.path)) !== asset.sha256) {
          throw new Error(`Файл изменился после preflight-проверки: ${asset.key}`);
        }
        // A concurrent importer may have created this key since preflight.
        // Verify it and skip instead of replacing any existing object.
        const appeared = await storage.fingerprint(asset.key);
        if (appeared) {
          if (appeared.size !== asset.size || appeared.sha256 !== asset.sha256) {
            throw new Error(
              `Объект не совпадает с bundle по content-addressed key: ${asset.key}`,
            );
          }
          continue;
        }
        await storage.putFile(asset);
        uploaded += 1;
      } catch (error) {
        firstError = error;
      }
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(Math.max(1, concurrency), assets.length) }, worker),
  );
  if (firstError !== undefined) throw firstError;
  return uploaded;
}

async function mapBounded<T, R>(
  values: T[],
  concurrency: number,
  operation: (value: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(values.length);
  let nextIndex = 0;
  let firstError: unknown;
  const worker = async () => {
    while (firstError === undefined) {
      const current = nextIndex;
      nextIndex += 1;
      if (current >= values.length) return;
      try {
        results[current] = await operation(values[current]);
      } catch (error) {
        firstError = error;
      }
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(Math.max(1, concurrency), values.length) }, worker),
  );
  if (firstError !== undefined) throw firstError;
  return results;
}

function validateCatalog(
  payload: CurriculumImportPayload,
  expectedTrack: SupportedExamTrack,
) {
  if (!payload || payload.schemaVersion !== 1 || payload.examTrack !== expectedTrack) {
    throw new Error(`Каталог ${expectedTrack} имеет неподдерживаемую схему или examTrack.`);
  }
  if (!Array.isArray(payload.tasks) || !payload.tasks.length) {
    throw new Error(`Каталог ${expectedTrack} не содержит заданий.`);
  }
  const source = payload.metadata?.source as Record<string, unknown> | undefined;
  const sourceSha256 = typeof source?.sha256 === 'string' ? source.sha256 : '';
  if (!SHA256_RE.test(sourceSha256)) {
    throw new Error(`У каталога ${expectedTrack} отсутствует корректный source SHA-256.`);
  }
  if (typeof payload.metadata?.importerVersion !== 'string' || !payload.metadata.importerVersion) {
    throw new Error(`У каталога ${expectedTrack} отсутствует importerVersion.`);
  }
  for (const field of ['filename', 'attribution', 'permissionProvenance'] as const) {
    if (typeof source?.[field] !== 'string' || !source[field]) {
      throw new Error(`В каталоге ${expectedTrack} отсутствует source.${field}.`);
    }
  }
  if (!Number.isInteger(source?.pageCount) || Number(source.pageCount) < 1) {
    throw new Error(`В каталоге ${expectedTrack} некорректное число страниц исходного PDF.`);
  }
  if (!Array.isArray(payload.topics) || payload.topics.length === 0) {
    throw new Error(`Каталог ${expectedTrack} не содержит тем.`);
  }
  for (const task of payload.tasks) {
    if (!TASK_ID_RE.test(task.externalId)) {
      throw new Error(`Неподдерживаемый source task id: ${task.externalId}`);
    }
    if (task.topicCode !== `Q${Number(task.externalId.split('.')[0])}`) {
      throw new Error(`Тема не соответствует экзаменационному номеру задания ${task.externalId}.`);
    }
  }
  return { sourceSha256: sourceSha256.toLowerCase() };
}

function validateObjectKey(
  key: unknown,
  track: SupportedExamTrack,
  sourceSha256: string,
) {
  if (typeof key !== 'string' || key.includes('\\') || key.startsWith('/')) {
    throw new Error('Некорректный object key изображения.');
  }
  const parts = key.split('/');
  if (
    parts.some((part) => !part || part === '.' || part === '..') ||
    parts.some((part) => !/^[a-zA-Z0-9._-]+$/.test(part)) ||
    !key.startsWith(`curriculum/assets/mathstart/${track}/${sourceSha256.toLowerCase()}/`) ||
    !key.endsWith('.webp')
  ) {
    throw new Error(`Object key изображения не соответствует треку и исходнику: ${key}`);
  }
}

async function validateLocalWebp(
  path: string,
  key: string,
  track: SupportedExamTrack,
): Promise<ValidatedAsset> {
  await access(path);
  const fileStat = await stat(path);
  if (!fileStat.isFile() || fileStat.size < 12) {
    throw new Error(`Изображение пустое или не является файлом: ${key}`);
  }
  const head = Buffer.alloc(12);
  const stream = createReadStream(path, { start: 0, end: 11 });
  let filled = 0;
  for await (const chunk of stream) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    buffer.copy(head, filled);
    filled += buffer.length;
  }
  if (
    head.toString('ascii', 0, 4) !== 'RIFF' ||
    head.toString('ascii', 8, 12) !== 'WEBP'
  ) {
    throw new Error(`Ожидался WebP-файл: ${key}`);
  }
  return {
    key,
    path,
    size: fileStat.size,
    sha256: await hashFile(path),
    track,
  };
}

async function hashFile(path: string): Promise<string> {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(path)) {
    hash.update(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return hash.digest('hex');
}

function parseArguments(argv: string[]): BundleImportOptions {
  let bundleDir = '';
  let apply = false;
  let activate = false;
  const tracks: SupportedExamTrack[] = [];
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--apply') {
      apply = true;
    } else if (arg === '--activate') {
      activate = true;
    } else if (arg === '--bundle') {
      bundleDir = argv[++index] ?? '';
    } else if (arg.startsWith('--bundle=')) {
      bundleDir = arg.slice('--bundle='.length);
    } else if (arg === '--track') {
      const value = argv[++index];
      if (value !== ExamTrack.EGE_BASE && value !== ExamTrack.EGE_PROFILE) {
        throw new Error('Поддерживаются только --track ege_base и --track ege_profile.');
      }
      tracks.push(value);
    } else if (arg.startsWith('--track=')) {
      const value = arg.slice('--track='.length);
      if (value !== ExamTrack.EGE_BASE && value !== ExamTrack.EGE_PROFILE) {
        throw new Error('Поддерживаются только --track ege_base и --track ege_profile.');
      }
      tracks.push(value);
    } else if (arg === '--help' || arg === '-h') {
      process.stdout.write(
        'Usage: npm run import:exam-bank -- --bundle <directory> [--track ege_base] [--track ege_profile] [--apply] [--activate]\n',
      );
      process.exit(0);
    } else {
      throw new Error(`Неизвестный аргумент: ${arg}`);
    }
  }
  const resolvedBundle = bundleDir ? resolve(bundleDir) : '';
  if (!bundleDir || !isAbsolute(resolvedBundle)) {
    throw new Error('Укажите абсолютный путь к каталогу bundle через --bundle.');
  }
  return {
    bundleDir: resolvedBundle,
    tracks: tracks.length ? tracks : [ExamTrack.EGE_BASE, ExamTrack.EGE_PROFILE],
    apply,
    activate,
  };
}

const curriculumEntities = [CurriculumRelease, CurriculumTopic, CurriculumTask];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [bundleConfiguration],
      envFilePath: [
        join(process.cwd(), 'backend/.env'),
        join(process.cwd(), '.env'),
        join(process.cwd(), '../.env'),
      ],
      expandVariables: false,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.user'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.name'),
        entities: curriculumEntities,
        migrationsRun: false,
        synchronize: false,
        logging: false,
      }),
    }),
    CurriculumModule,
  ],
})
class BundleImportApplicationModule {}

class NestCatalogAdapter implements CatalogImportAdapter {
  constructor(
    private readonly curriculum: CurriculumService,
    private readonly dataSource: DataSource,
  ) {}

  preview(payload: CurriculumImportPayload) {
    const { hash, stats, warnings } = this.curriculum.preview(payload);
    return { hash, stats, warnings };
  }

  async findRelease(input: { examTrack: ExamTrack; year: number; version: string }) {
    const release = await this.dataSource.getRepository(CurriculumRelease).findOne({
      where: input,
    });
    if (!release) return undefined;
    return {
      id: release.id,
      importHash: typeof release.metadata?.importHash === 'string'
        ? release.metadata.importHash
        : undefined,
      isActive: release.isActive,
    };
  }

  async importPayload(payload: CurriculumImportPayload, dryRun: boolean) {
    return this.curriculum.importPayload(payload, dryRun);
  }

  async activate(releaseId: string) {
    await this.curriculum.activate(releaseId);
  }
}

class MinioAssetStorage implements BundleAssetStorage {
  constructor(
    private readonly client: Client,
    private readonly bucket: string,
  ) {}

  async bucketExists() {
    return this.client.bucketExists(this.bucket);
  }

  async fingerprint(key: string) {
    try {
      const info = await this.client.statObject(this.bucket, key);
      const metadata = info.metaData ?? {};
      const knownSha256 =
        metadata['x-amz-meta-sha256'] ?? metadata['X-Amz-Meta-Sha256'];
      if (typeof knownSha256 === 'string' && SHA256_RE.test(knownSha256)) {
        return { size: info.size, sha256: knownSha256.toLowerCase() };
      }
      const object = await this.client.getObject(this.bucket, key);
      const hash = createHash('sha256');
      let size = 0;
      for await (const chunk of object) {
        const data = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        size += data.length;
        hash.update(data);
      }
      return { size, sha256: hash.digest('hex') };
    } catch (error: unknown) {
      const code =
        typeof error === 'object' && error !== null && 'code' in error
          ? String((error as { code?: unknown }).code)
          : '';
      if (code === 'NoSuchKey' || code === 'NotFound') return undefined;
      throw error;
    }
  }

  async putFile(asset: AssetRecord) {
    await this.client.fPutObject(this.bucket, asset.key, asset.path, {
      'Content-Type': 'image/webp',
      'Cache-Control': 'private, max-age=3600',
      'x-amz-meta-sha256': asset.sha256,
    });
  }
}

async function runCli() {
  const options = parseArguments(process.argv.slice(2));
  const app = await NestFactory.createApplicationContext(BundleImportApplicationModule, {
    logger: false,
    abortOnError: false,
  });
  try {
    const config = app.get(ConfigService);
    const curriculum = app.get(CurriculumService);
    const dataSource = app.get(DataSource);
    const storage = new Client({
      endPoint: config.get<string>('storage.endPoint'),
      port: config.get<number>('storage.port'),
      useSSL: config.get<boolean>('storage.useSSL'),
      accessKey: config.get<string>('storage.accessKey'),
      secretKey: config.get<string>('storage.secretKey'),
      region: config.get<string>('storage.region'),
      pathStyle: true,
    });
    const report = await importExamBankBundle(options, {
      db: new NestCatalogAdapter(curriculum, dataSource),
      storage: new MinioAssetStorage(storage, config.get<string>('storage.bucket')),
    });
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } finally {
    await app.close();
  }
}

if (require.main === module) {
  runCli().catch((error: unknown) => {
    let detail = error instanceof Error ? error.message : String(error);
    for (const name of [
      'DATABASE_PASSWORD',
      'MINIO_SECRET_KEY',
      'MINIO_ACCESS_KEY',
      'JWT_SECRET',
      'JWT_REFRESH_SECRET',
      'LIVEKIT_API_SECRET',
      'SMTP_PASS',
    ]) {
      const secret = process.env[name];
      if (secret) detail = detail.split(secret).join('[redacted]');
    }
    process.stderr.write(
      `Import failed: ${detail}\nNo rollback was attempted; inspect release state before retrying.\n`,
    );
    process.exitCode = 1;
  });
}
