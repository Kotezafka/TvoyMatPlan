import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  BundleImportDependencies,
  importExamBankBundle,
} from '../../scripts/import_pdf_exam_bank_bundle';
import { ExamTrack } from './entities/curriculum.entity';

const sha256 = 'a'.repeat(64);
const imageKey = `curriculum/assets/mathstart/ege_base/${sha256}/1.1/0.webp`;
const payload = {
  schemaVersion: 1 as const,
  examTrack: 'ege_base' as const,
  year: 2026,
  version: '2026.1-images',
  title: 'Test release',
  sourceKind: 'imported' as const,
  metadata: {
    importerVersion: '1.0.0',
    source: {
      filename: 'source.pdf',
      sha256,
      attribution: 'Permission granted',
      permissionProvenance: 'direct authorization',
      pageCount: 2,
    },
  },
  topics: [{ code: 'Q1', title: 'Question 1', position: 1 }],
  tasks: [
    {
      externalId: '1.1',
      topicCode: 'Q1',
      taskType: 'fipi_exam_task',
      difficulty: 'basic' as const,
      statement: 'Solve.',
      acceptedAnswers: ['2'],
      metadata: {
        imageKeys: [imageKey],
        sourceTaskId: '1.1',
        sourcePageStart: 1,
        sourcePageEnd: 1,
        imageWidth: 640,
        imageHeight: 320,
        importerVersion: '1.0.0',
      },
    },
  ],
};

const validWebp = Buffer.from([
  0x52, 0x49, 0x46, 0x46, 0x08, 0, 0, 0, 0x57, 0x45, 0x42, 0x50,
  0, 0, 0, 0,
]);

async function makeBundle() {
  const bundleDir = await mkdtemp(join(tmpdir(), 'exam-bank-bundle-'));
  const localImage = join(bundleDir, 'images', imageKey);
  await mkdir(join(localImage, '..'), { recursive: true });
  await writeFile(localImage, validWebp);
  await writeFile(join(bundleDir, 'ege_base.json'), JSON.stringify(payload));
  return { bundleDir, localImage };
}

function dependencies(overrides: Partial<BundleImportDependencies> = {}) {
  const db = {
    preview: jest.fn().mockReturnValue({
      hash: 'catalog-hash',
      stats: { topics: 1, tasks: 1, taskTypes: 1, tasksWithoutAnswers: 0 },
      warnings: [],
    }),
    findRelease: jest.fn().mockResolvedValue(undefined),
    importPayload: jest.fn().mockResolvedValue({
      dryRun: false,
      idempotent: false,
      releaseId: 'release-123',
      topicCount: 1,
      taskCount: 1,
      warnings: [],
    }),
    activate: jest.fn().mockResolvedValue(undefined),
  };
  const storage = {
    bucketExists: jest.fn().mockResolvedValue(true),
    fingerprint: jest.fn().mockResolvedValue(undefined),
    putFile: jest.fn().mockResolvedValue(undefined),
  };
  return {
    deps: { db, storage, ...overrides } as unknown as BundleImportDependencies,
    db,
    storage,
  };
}

describe('importExamBankBundle', () => {
  let bundleDir: string;

  afterEach(async () => {
    if (bundleDir) await rm(bundleDir, { recursive: true, force: true });
    bundleDir = '';
  });

  it('dry-runs with fully validated assets and performs no writes', async () => {
    const bundle = await makeBundle();
    bundleDir = bundle.bundleDir;
    const { deps, db, storage } = dependencies();

    const report = await importExamBankBundle(
      { bundleDir, tracks: [ExamTrack.EGE_BASE], apply: false },
      deps,
    );

    expect(report.mode).toBe('dry-run');
    expect(report.releases[0]).toMatchObject({ tasks: 1, missingAssets: 1, uploadCount: 0 });
    expect(storage.putFile).not.toHaveBeenCalled();
    expect(db.importPayload).not.toHaveBeenCalled();
  });

  it('uploads immutable image bytes before importing an inactive release', async () => {
    const bundle = await makeBundle();
    bundleDir = bundle.bundleDir;
    const { deps, db, storage } = dependencies();
    db.findRelease
      .mockResolvedValueOnce(undefined)
      .mockResolvedValue({ id: 'release-123', importHash: 'catalog-hash', isActive: false });

    const report = await importExamBankBundle(
      { bundleDir, tracks: [ExamTrack.EGE_BASE], apply: true },
      deps,
    );

    expect(storage.putFile).toHaveBeenCalledWith(
      expect.objectContaining({ key: imageKey, size: validWebp.length }),
    );
    expect(db.importPayload).toHaveBeenCalledWith(payload, false);
    expect(report.mode).toBe('applied');
    expect(report.releases[0].releaseId).toBe('release-123');
  });

  it('rejects missing or malformed image assets before any writes', async () => {
    const bundle = await makeBundle();
    bundleDir = bundle.bundleDir;
    await writeFile(bundle.localImage, Buffer.from('not webp'));
    const { deps, db, storage } = dependencies();

    await expect(
      importExamBankBundle(
        { bundleDir, tracks: [ExamTrack.EGE_BASE], apply: true },
        deps,
      ),
    ).rejects.toThrow(/WebP/i);

    expect(storage.putFile).not.toHaveBeenCalled();
    expect(db.importPayload).not.toHaveBeenCalled();
  });

  it('rejects conflicting bytes already stored under a content-addressed key', async () => {
    const bundle = await makeBundle();
    bundleDir = bundle.bundleDir;
    const { deps, db, storage } = dependencies();
    storage.fingerprint.mockResolvedValue({ size: validWebp.length, sha256: 'different-content-hash' });

    await expect(
      importExamBankBundle(
        { bundleDir, tracks: [ExamTrack.EGE_BASE], apply: true },
        deps,
      ),
    ).rejects.toThrow(/content-addressed key/i);

    expect(storage.putFile).not.toHaveBeenCalled();
    expect(db.importPayload).not.toHaveBeenCalled();
  });

  it('repairs missing objects for an existing identical inactive release idempotently', async () => {
    const bundle = await makeBundle();
    bundleDir = bundle.bundleDir;
    const { deps, db, storage } = dependencies();
    db.findRelease.mockResolvedValue({
      id: 'release-existing',
      importHash: 'catalog-hash',
      isActive: false,
    });
    db.importPayload.mockResolvedValue({
      dryRun: false,
      idempotent: true,
      releaseId: 'release-existing',
      topicCount: 1,
      taskCount: 1,
      warnings: [],
    });

    const report = await importExamBankBundle(
      { bundleDir, tracks: [ExamTrack.EGE_BASE], apply: true },
      deps,
    );

    expect(storage.putFile).toHaveBeenCalledTimes(1);
    expect(db.importPayload).toHaveBeenCalledTimes(1);
    expect(report.releases[0].idempotent).toBe(true);
  });

  it('refuses an existing active release before upload/import', async () => {
    const bundle = await makeBundle();
    bundleDir = bundle.bundleDir;
    const { deps, db, storage } = dependencies();
    db.findRelease.mockResolvedValue({
      id: 'release-existing',
      importHash: 'catalog-hash',
      isActive: true,
    });

    await expect(
      importExamBankBundle(
        { bundleDir, tracks: [ExamTrack.EGE_BASE], apply: true },
        deps,
      ),
    ).rejects.toThrow(/уже активна/i);

    expect(storage.putFile).not.toHaveBeenCalled();
    expect(db.importPayload).not.toHaveBeenCalled();
  });

  it('requires explicit apply before activation and activates only after import checks', async () => {
    const bundle = await makeBundle();
    bundleDir = bundle.bundleDir;
    const { deps, db } = dependencies();
    db.findRelease
      .mockResolvedValueOnce(undefined)
      .mockResolvedValue({ id: 'release-123', importHash: 'catalog-hash', isActive: false });

    await expect(
      importExamBankBundle(
        { bundleDir, tracks: [ExamTrack.EGE_BASE], apply: false, activate: true },
        deps,
      ),
    ).rejects.toThrow(/--activate требует явного --apply/);
    expect(db.activate).not.toHaveBeenCalled();

    const report = await importExamBankBundle(
      { bundleDir, tracks: [ExamTrack.EGE_BASE], apply: true, activate: true },
      deps,
    );
    expect(db.activate).toHaveBeenCalledWith('release-123');
    expect(report.releases[0]).toMatchObject({ active: true, activated: true });
  });
});
