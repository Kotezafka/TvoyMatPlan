import { LessonProcessingService } from './lesson-processing.service';
import { LessonStatus } from './entities/lesson.entity';
import { ComputeJobStatus } from './entities/compute-job.entity';

describe('LessonProcessingService', () => {
  it('adds parent questions to new reports and normalizes their answers', async () => {
    const service = new LessonProcessingService(
      { get: jest.fn((key: string) => ({
        'ollama.url': 'http://ollama.test',
        'ollama.model': 'qwen2.5:3b',
        'ollama.contextWindow': 8192,
      }[key])) } as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );
    const originalFetch = global.fetch;
    const question = 'Что ученик понял лучше всего?';
    const fetchMock = jest.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body));
      expect(body.prompt).toContain(question);
      expect(body.prompt).toContain('parentAnswers');
      return new Response(JSON.stringify({ response: JSON.stringify({
        summary: 'Работали с уравнениями.',
        topics: ['Уравнения'],
        achievements: [],
        difficulties: [],
        homework: [],
        recommendations: [],
        keyMoments: [],
        parentAnswers: [{ question, answer: 'Ученик самостоятельно решил пример.' }],
      }) }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    });
    global.fetch = fetchMock as any;

    try {
      const result = await (service as any).generateReport(
        'Решим уравнение. Ученик решает пример самостоятельно.',
        undefined,
        [question],
      );

      expect(result.parentAnswers).toEqual([
        { question, answer: 'Ученик самостоятельно решил пример.' },
      ]);
    } finally {
      global.fetch = originalFetch;
    }
  });

  it('transcribes a saved recording, generates a report, and persists both artifacts', async () => {
    const storage = {
      exists: jest.fn().mockResolvedValue(true),
      presignedGetUrl: jest.fn().mockResolvedValue('https://storage.test/audio.ogg'),
      putText: jest.fn().mockResolvedValue(undefined),
      putJson: jest.fn().mockResolvedValue(undefined),
    };
    const lessonRepo = {
      exists: jest.fn().mockResolvedValue(true),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };
    const lessons = { markBookingsCompleted: jest.fn().mockResolvedValue(undefined) };
    const notifications = {
      notifyLessonReportReady: jest.fn().mockResolvedValue(undefined),
    };
    const learning = {
      createDraftsForLesson: jest.fn().mockResolvedValue(undefined),
    };
    const configValues: Record<string, string | number> = {
      'compute.mode': 'local',
      'compute.apiUrl': '',
      'transcription.url': 'http://transcriber.test',
      'transcription.language': 'ru',
      'ollama.url': 'http://ollama.test',
      'ollama.model': 'qwen2.5:3b',
      'ollama.contextWindow': 8192,
    };
    const service = new LessonProcessingService(
      { get: jest.fn((key: string) => configValues[key]) } as any,
      storage as any,
      lessons as any,
      notifications as any,
      lessonRepo as any,
      {} as any,
      learning as any,
    );
    const report = {
      summary: 'Решали уравнения с дробями.',
      topics: ['Уравнения с дробями'],
      achievements: ['Ученик решил уравнение самостоятельно'],
      difficulties: [],
      homework: ['Решить задачи 1–3'],
      recommendations: ['Повторить проверку решения'],
      keyMoments: [{ time: '00:12:00', description: 'Самостоятельное решение' }],
    };
    const originalFetch = global.fetch;
    const fetchMock = jest.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith('/transcribe')) {
        return new Response(
          JSON.stringify({
            text: 'Решим уравнение с дробями. На дом задачи с первого по третий номер.',
            language: 'ru',
            duration: 1800,
            segments: [
              { start: 12, end: 20, text: 'Решим уравнение с дробями.' },
              { start: 1750, end: 1760, text: 'На дом задачи с первого по третий номер.' },
            ],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        );
      }
      if (url.endsWith('/api/generate')) {
        return new Response(JSON.stringify({ response: JSON.stringify(report) }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`Unexpected URL in report processing test: ${url}`);
    });
    global.fetch = fetchMock as any;
    const lesson = {
      id: 'lesson-audio-id',
      slotId: 'slot-id',
      status: LessonStatus.PROCESSING,
      startedAt: new Date(),
      endedAt: new Date(),
      recordingObjectKey: 'lessons/lesson-audio-id/audio.ogg',
      transcriptObjectKey: null,
      transcriptLanguage: null,
      transcriptDurationSeconds: null,
      processingAttempts: 0,
      teacher: { userId: 'teacher-user-id' },
      slot: { note: 'Обыкновенные дроби', startTime: new Date() },
    };

    try {
      await (service as any).processOne(lesson, 'lease-id');
    } finally {
      global.fetch = originalFetch;
    }

    expect(storage.presignedGetUrl).toHaveBeenCalledWith(
      'lessons/lesson-audio-id/audio.ogg',
      4 * 60 * 60,
    );
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(storage.putText).toHaveBeenCalledWith(
      'lessons/lesson-audio-id/transcript.txt',
      '[00:00:12] Решим уравнение с дробями.\n[00:29:10] На дом задачи с первого по третий номер.',
    );
    expect(storage.putJson).toHaveBeenCalledWith(
      'lessons/lesson-audio-id/report.json',
      expect.objectContaining({ summary: report.summary, homework: report.homework }),
    );
    expect(lessonRepo.update).toHaveBeenLastCalledWith(
      expect.objectContaining({ status: LessonStatus.PROCESSING }),
      expect.objectContaining({
        status: LessonStatus.COMPLETED,
        reportObjectKey: 'lessons/lesson-audio-id/report.json',
        transcriptObjectKey: 'lessons/lesson-audio-id/transcript.txt',
        report: expect.objectContaining({ summary: report.summary }),
      }),
    );
    expect(lessons.markBookingsCompleted).toHaveBeenCalledWith('slot-id');
    expect(notifications.notifyLessonReportReady).toHaveBeenCalledWith(
      'teacher-user-id',
      'lesson-audio-id',
      lesson.slot.startTime,
    );
  });

  it('creates a report when a participant visited but no recording was saved', async () => {
    const storage = {
      putJson: jest.fn().mockResolvedValue(undefined),
    };
    const lessonRepo = {
      exists: jest.fn().mockResolvedValue(true),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };
    const lessons = { markBookingsCompleted: jest.fn().mockResolvedValue(undefined) };
    const notifications = {
      notifyLessonReportReady: jest.fn().mockResolvedValue(undefined),
    };
    const learning = {
      createDraftsForLesson: jest.fn().mockResolvedValue(undefined),
    };
    const service = new LessonProcessingService(
      { get: jest.fn().mockReturnValue('') } as any,
      storage as any,
      lessons as any,
      notifications as any,
      lessonRepo as any,
      {} as any,
      learning as any,
    );
    const lesson = {
      id: 'lesson-id',
      slotId: 'slot-id',
      status: LessonStatus.PROCESSING,
      startedAt: new Date(),
      endedAt: new Date(),
      recordingObjectKey: null,
      transcriptObjectKey: null,
      transcriptLanguage: null,
      transcriptDurationSeconds: null,
      processingAttempts: 0,
      teacher: { userId: 'teacher-user-id' },
      slot: { note: null, startTime: new Date() },
    };

    await (service as any).processOne(lesson, 'lease-id');

    expect(storage.putJson).toHaveBeenCalledWith(
      'lessons/lesson-id/report.json',
      expect.objectContaining({
        summary: expect.stringContaining('В урок зашли'),
      }),
    );
    expect(lessonRepo.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: LessonStatus.PROCESSING }),
      expect.objectContaining({
        status: LessonStatus.COMPLETED,
        reportObjectKey: 'lessons/lesson-id/report.json',
      }),
    );
  });

  it('still creates a report after repeated processing failures when the lesson was visited', async () => {
    const builder: any = {};
    builder.update = jest.fn().mockReturnValue(builder);
    builder.set = jest.fn().mockReturnValue(builder);
    builder.where = jest.fn().mockReturnValue(builder);
    builder.andWhere = jest.fn().mockReturnValue(builder);
    builder.execute = jest.fn().mockResolvedValue({ affected: 1 });

    const storage = {
      exists: jest.fn().mockResolvedValue(false),
      putJson: jest.fn().mockResolvedValue(undefined),
    };
    const lessonRepo = {
      createQueryBuilder: jest.fn().mockReturnValue(builder),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };
    const lessons = { markBookingsCompleted: jest.fn().mockResolvedValue(undefined) };
    const notifications = {
      notifyLessonReportReady: jest.fn().mockResolvedValue(undefined),
    };
    const learning = {
      createDraftsForLesson: jest.fn().mockResolvedValue(undefined),
    };
    const service = new LessonProcessingService(
      { get: jest.fn().mockReturnValue('') } as any,
      storage as any,
      lessons as any,
      notifications as any,
      lessonRepo as any,
      {} as any,
      learning as any,
    );
    (service as any).processOne = jest
      .fn()
      .mockRejectedValue(new Error('transcription unavailable'));
    const lesson = {
      id: 'lesson-id',
      slotId: 'slot-id',
      status: LessonStatus.PROCESSING,
      startedAt: new Date(),
      endedAt: new Date(),
      participantCount: 0,
      processingAttempts: 9,
      teacher: { userId: 'teacher-user-id' },
      slot: { startTime: new Date() },
    };

    await (service as any).processOneSafely(lesson);

    expect(storage.putJson).toHaveBeenCalledWith(
      'lessons/lesson-id/report.json',
      expect.objectContaining({
        summary: expect.stringContaining('Урок посещали'),
      }),
    );
    expect(lessonRepo.update).toHaveBeenCalledWith(
      expect.objectContaining({
        status: LessonStatus.PROCESSING,
        processingLeaseId: expect.any(String),
      }),
      expect.objectContaining({
        status: LessonStatus.COMPLETED,
        reportObjectKey: 'lessons/lesson-id/report.json',
      }),
    );
  });

  it('stores a transcript-derived draft in the lesson when Ollama and report object storage fail', async () => {
    const transcript =
      '[00:01:00] Преподаватель: Решим уравнение x + 2 = 5. Ученик: Вычитаю два и получаю x = 3.';
    const lesson = {
      id: 'lesson-fallback-id',
      slotId: 'slot-id',
      status: LessonStatus.PROCESSING,
      participantCount: 1,
      startedAt: new Date(),
      endedAt: new Date(),
      recordingObjectKey: 'lessons/lesson-fallback-id/audio.ogg',
      transcriptObjectKey: 'lessons/lesson-fallback-id/transcript.txt',
      processingAttempts: 9,
      processingLeaseId: null,
      processingError: null,
      teacher: { userId: 'teacher-user-id' },
      slot: { note: 'Линейные уравнения', startTime: new Date() },
    };
    const builder: any = {};
    builder.update = jest.fn().mockReturnValue(builder);
    builder.set = jest.fn().mockReturnValue(builder);
    builder.where = jest.fn().mockReturnValue(builder);
    builder.andWhere = jest.fn().mockReturnValue(builder);
    builder.execute = jest.fn().mockResolvedValue({ affected: 1 });

    const lessonRepo = {
      createQueryBuilder: jest.fn().mockReturnValue(builder),
      exists: jest.fn().mockResolvedValue(true),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };
    const storage = {
      exists: jest.fn().mockResolvedValue(true),
      getBuffer: jest.fn().mockResolvedValue(Buffer.from(transcript)),
      putJson: jest.fn().mockRejectedValue(new Error('Access Denied')),
    };
    const lessons = {
      markBookingsCompleted: jest.fn().mockResolvedValue(undefined),
    };
    const notifications = {
      notifyLessonReportReady: jest.fn().mockResolvedValue(undefined),
    };
    const learning = {
      createDraftsForLesson: jest.fn().mockResolvedValue(undefined),
    };
    const configValues: Record<string, string | number> = {
      'compute.mode': 'local',
      'compute.apiUrl': '',
      'ollama.url': 'http://ollama.test',
      'ollama.model': 'qwen2.5:3b',
      'ollama.contextWindow': 8192,
    };
    const service = new LessonProcessingService(
      { get: jest.fn((key: string) => configValues[key]) } as any,
      storage as any,
      lessons as any,
      notifications as any,
      lessonRepo as any,
      {} as any,
      learning as any,
    );
    const originalFetch = global.fetch;
    const fetchMock = jest.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: 'llama-server process has terminated: signal: killed',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      ),
    );
    global.fetch = fetchMock as any;

    try {
      await (service as any).processOneSafely(lesson);
    } finally {
      global.fetch = originalFetch;
    }

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const completion = lessonRepo.update.mock.calls.find(
      ([, patch]) => patch.status === LessonStatus.COMPLETED,
    );
    expect(completion).toBeDefined();
    expect(completion[1]).toEqual(
      expect.objectContaining({
        status: LessonStatus.COMPLETED,
        processingAttempts: 10,
        processingError: null,
        reportObjectKey: null,
        report: {
          summary: expect.stringContaining('Черновик отчёта'),
          topics: ['Линейные уравнения'],
          achievements: [],
          difficulties: [],
          homework: [],
          recommendations: [],
          keyMoments: [],
          parentAnswers: [],
        },
      }),
    );
    expect(completion[1].report.summary).toContain(
      '[00:01:00] Преподаватель: Решим уравнение x + 2 = 5.',
    );
    expect(storage.putJson).toHaveBeenCalledWith(
      'lessons/lesson-fallback-id/report.json',
      completion[1].report,
    );
    expect(lessons.markBookingsCompleted).toHaveBeenCalledWith('slot-id');
    expect(notifications.notifyLessonReportReady).toHaveBeenCalledWith(
      'teacher-user-id',
      'lesson-fallback-id',
      lesson.slot.startTime,
    );
  });

  it('completes a remote job with a transcript draft after its retries are exhausted', async () => {
    const transcript = {
      text: 'Решим уравнение x + 2 = 5. Ученик вычитает два и получает x = 3.',
      language: 'ru',
      duration: 60,
      segments: [],
    };
    const lesson = {
      id: 'remote-fallback-id',
      slotId: 'slot-id',
      status: LessonStatus.PROCESSING,
      startedAt: new Date(),
      participantCount: 1,
      transcriptObjectKey: 'lessons/remote-fallback-id/transcript.txt',
      transcriptLanguage: 'ru',
      transcriptDurationSeconds: 60,
      endedAt: new Date(),
      teacher: { userId: 'teacher-user-id' },
      slot: { note: 'Линейные уравнения', startTime: new Date() },
    };
    const job = {
      id: 'job-id',
      lessonId: lesson.id,
      status: ComputeJobStatus.PROCESSING,
      attempts: 10,
      lessonNote: 'Линейные уравнения',
    };
    const manager = {
      findOne: jest
        .fn()
        .mockResolvedValueOnce(job)
        .mockResolvedValueOnce(lesson),
      findOneBy: jest.fn().mockResolvedValue({ id: lesson.id, teacherId: 'teacher-id' }),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };
    const dataSource = {
      transaction: jest.fn((work) => work(manager)),
    };
    const storage = {
      exists: jest.fn().mockResolvedValue(true),
      getJson: jest.fn().mockResolvedValue(transcript),
      putJson: jest.fn().mockRejectedValue(new Error('Access Denied')),
    };
    const lessons = {
      markBookingsCompleted: jest.fn().mockResolvedValue(undefined),
    };
    const notifications = {
      notifyLessonReportReady: jest.fn().mockResolvedValue(undefined),
      notifyLessonFailed: jest.fn().mockResolvedValue(undefined),
    };
    const learning = {
      createDraftsForLesson: jest.fn().mockResolvedValue(undefined),
    };
    const service = new LessonProcessingService(
      {} as any,
      storage as any,
      lessons as any,
      notifications as any,
      {} as any,
      { findOne: jest.fn() } as any,
      learning as any,
      {} as any,
      dataSource as any,
    );

    const result = await service.failLocalComputeJob(
      'job-id',
      'lease-token',
      'Ollama runner was killed',
    );

    expect(result).toEqual({ ok: true, status: LessonStatus.COMPLETED });
    const completedLesson = manager.update.mock.calls.find(
      ([entity, , patch]) => entity.name === 'Lesson' && patch.status === LessonStatus.COMPLETED,
    );
    expect(completedLesson).toBeDefined();
    expect(completedLesson[2]).toEqual(
      expect.objectContaining({
        status: LessonStatus.COMPLETED,
        processingError: null,
        reportObjectKey: null,
        report: expect.objectContaining({
          summary: expect.stringContaining('Черновик отчёта'),
          topics: ['Линейные уравнения'],
          achievements: [],
          difficulties: [],
          homework: [],
          recommendations: [],
          keyMoments: [],
        }),
      }),
    );
    expect(completedLesson[2].report.summary).toContain(
      'Решим уравнение x + 2 = 5.',
    );
    expect(storage.putJson).toHaveBeenCalledWith(
      'lessons/remote-fallback-id/report.json',
      completedLesson[2].report,
    );
    expect(lessons.markBookingsCompleted).toHaveBeenCalledWith('slot-id');
    expect(notifications.notifyLessonReportReady).toHaveBeenCalledWith(
      'teacher-user-id',
      'remote-fallback-id',
      lesson.slot.startTime,
    );
    expect(notifications.notifyLessonFailed).not.toHaveBeenCalled();
  });

  it('completes a remote report from in-memory data when MinIO rejects every artifact write', async () => {
    const transcript = {
      text: 'Обсудили законы Ньютона и решили задачу о движении тела.',
      language: 'ru',
      duration: 120,
      segments: [{ start: 10, end: 20, text: 'Решим задачу о движении тела.' }],
    };
    const report = {
      summary: 'Разобрали задачу о движении тела.',
      topics: ['Законы Ньютона'],
      achievements: [],
      difficulties: [],
      homework: [],
      recommendations: [],
      keyMoments: [],
    };
    const lesson = {
      id: 'lesson-storage-outage',
      slotId: 'slot-id',
      status: LessonStatus.PROCESSING,
      transcriptObjectKey: null,
      teacher: { userId: 'teacher-user-id' },
      slot: { note: 'Динамика', startTime: new Date() },
      endedAt: new Date(),
    };
    const job = { id: 'compute-job', lessonId: lesson.id };
    const manager = {
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };
    const dataSource = {
      transaction: jest.fn((work) => work(manager)),
    };
    const storage = {
      exists: jest.fn().mockResolvedValue(false),
      putJson: jest.fn().mockRejectedValue(new Error('Access Denied')),
      putText: jest.fn().mockRejectedValue(new Error('Access Denied')),
    };
    const lessons = { markBookingsCompleted: jest.fn().mockResolvedValue(undefined) };
    const notifications = {
      notifyLessonReportReady: jest.fn().mockResolvedValue(undefined),
    };
    const learning = { createDraftsForLesson: jest.fn().mockResolvedValue(undefined) };
    const lessonRepo = { findOne: jest.fn().mockResolvedValue(lesson) };
    const service = new LessonProcessingService(
      {} as any,
      storage as any,
      lessons as any,
      notifications as any,
      lessonRepo as any,
      {} as any,
      learning as any,
      {} as any,
      dataSource as any,
    );
    jest
      .spyOn(service as any, 'findActiveLocalComputeJob')
      .mockResolvedValue(job);

    const result = await service.completeLocalComputeJob(
      job.id,
      'lease-token',
      transcript,
      report,
    );

    expect(result).toEqual({ ok: true, status: LessonStatus.COMPLETED });
    const lessonCompletion = manager.update.mock.calls.find(
      ([entity, , patch]) => entity.name === 'Lesson' && patch.status === LessonStatus.COMPLETED,
    );
    expect(lessonCompletion).toBeDefined();
    expect(lessonCompletion[2]).toEqual(
      expect.objectContaining({
        status: LessonStatus.COMPLETED,
        reportObjectKey: null,
        transcriptObjectKey: null,
        report: expect.objectContaining({ summary: report.summary }),
      }),
    );
    expect(lessons.markBookingsCompleted).toHaveBeenCalledWith(lesson.slotId);
    expect(notifications.notifyLessonReportReady).toHaveBeenCalledWith(
      'teacher-user-id',
      lesson.id,
      lesson.slot.startTime,
    );
  });
});
