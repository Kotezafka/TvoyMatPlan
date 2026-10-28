import { ExamTrack, TaskDifficulty } from '../entities/curriculum.entity';
import { buildDeepMindCurricula } from './deepmind-math.v1';
import { CurriculumService } from '../curriculum.service';
import { CurriculumSourceKind } from '../entities/curriculum.entity';

describe('DeepMind mathematics curriculum bank', () => {
  it('provides a usable attributed bank for each supported math track', () => {
    const releases = buildDeepMindCurricula();

    expect(releases.map((release) => release.examTrack).sort()).toEqual(
      [ExamTrack.EGE_BASE, ExamTrack.EGE_PROFILE, ExamTrack.OGE].sort(),
    );
    for (const release of releases) {
      expect(release.sourceKind).toBe('imported');
      expect(release.metadata?.license).toBe('Apache-2.0');
      expect(release.metadata?.sourceUrl).toContain('google-deepmind/mathematics_dataset');
      expect(release.tasks.length).toBeGreaterThanOrEqual(20);
      expect(release.tasks.filter((task) => task.difficulty === TaskDifficulty.ADVANCED).length).toBeGreaterThanOrEqual(4);
      expect(release.tasks.every((task) => task.acceptedAnswers.length > 0)).toBe(true);
      expect(release.tasks.every((task) => task.statement.length > 0)).toBe(true);
      expect(release.tasks.every((task) => Object.values(TaskDifficulty).includes(task.difficulty))).toBe(true);
      expect(release.tasks.some((task) => /[а-яё]/i.test(task.statement))).toBe(true);
      expect(release.tasks.every((task) => task.metadata?.synthetic === true)).toBe(true);
      expect(release.tasks.every((task) => task.topicCode && task.externalId)).toBe(true);
    }
  });

  it('does not replace an existing imported release, but replaces demo releases', async () => {
    const service = new CurriculumService(
      { findOne: jest.fn().mockResolvedValue({ sourceKind: CurriculumSourceKind.IMPORTED }) } as any,
      {} as any,
      {} as any,
      {} as any,
    );
    jest.spyOn(service, 'importPayload').mockImplementation(async (payload) => ({
      dryRun: false,
      idempotent: true,
      releaseId: `release-${payload.examTrack}`,
      topicCount: payload.topics.length,
      taskCount: payload.tasks.length,
      warnings: [],
    }));
    const activate = jest.spyOn(service, 'activate').mockResolvedValue({} as any);

    const results = await service.importDeepMindCurricula();

    expect(activate).not.toHaveBeenCalled();
    expect(results).toHaveLength(3);

    const demoService = new CurriculumService(
      { findOne: jest.fn().mockResolvedValue({ sourceKind: CurriculumSourceKind.DEMO }) } as any,
      {} as any,
      {} as any,
      {} as any,
    );
    jest.spyOn(demoService, 'importPayload').mockImplementation(async (payload) => ({
      dryRun: false,
      idempotent: true,
      releaseId: `release-${payload.examTrack}`,
      topicCount: payload.topics.length,
      taskCount: payload.tasks.length,
      warnings: [],
    }));
    const activateDemo = jest.spyOn(demoService, 'activate').mockResolvedValue({} as any);

    await demoService.importDeepMindCurricula();

    expect(activateDemo).toHaveBeenCalledTimes(3);

    const fipiService = new CurriculumService(
      {
        findOne: jest.fn().mockResolvedValue({
          title: 'Imported FIPI bank',
          sourceKind: CurriculumSourceKind.IMPORTED,
          metadata: { sourceUrl: 'https://ege.fipi.ru/bank/' },
        }),
      } as any,
      {} as any,
      {} as any,
      {} as any,
    );
    jest.spyOn(fipiService, 'importPayload').mockImplementation(async (payload) => ({
      dryRun: false,
      idempotent: true,
      releaseId: `release-${payload.examTrack}`,
      topicCount: payload.topics.length,
      taskCount: payload.tasks.length,
      warnings: [],
    }));
    const activateFipi = jest.spyOn(fipiService, 'activate').mockResolvedValue({} as any);

    await fipiService.importDeepMindCurricula();

    expect(activateFipi).not.toHaveBeenCalled();
  });
});
