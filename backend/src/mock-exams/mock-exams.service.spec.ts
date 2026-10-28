import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ExamTrack, CurriculumSourceKind } from '../curriculum/entities/curriculum.entity';
import { UserRole } from '../users/enums/user-role.enum';
import { MockExamsService } from './mock-exams.service';

describe('MockExamsService', () => {
  const user = { id: 'user-1', role: UserRole.STUDENT } as any;
  const student = { id: 'student-1', teacherId: 'teacher-1' } as any;
  const profile = { studentId: student.id, examTrack: ExamTrack.EGE_PROFILE } as any;

  const createService = (sourceKind: CurriculumSourceKind, tasks: any[] = [{ id: 'task-1' }]) => {
    const examRepo = { create: jest.fn(), save: jest.fn() };
    const studentRepo = { findOneBy: jest.fn().mockResolvedValue(student) };
    const teacherRepo = {};
    const profileRepo = { findOne: jest.fn().mockResolvedValue(profile) };
    const dataSource = {};
    const curriculum = {
      getActiveRelease: jest.fn().mockResolvedValue({ sourceKind, tasks }),
    };
    const progress = {};
    const service = new MockExamsService(
      examRepo as any,
      studentRepo as any,
      teacherRepo as any,
      profileRepo as any,
      dataSource as any,
      curriculum as any,
      progress as any,
    );
    return { service, examRepo, curriculum };
  };

  it('does not start a student mock exam from a synthetic demo catalog', async () => {
    const { service, examRepo } = createService(CurriculumSourceKind.DEMO);

    await expect(service.startForStudent(user)).rejects.toBeInstanceOf(BadRequestException);
    expect(examRepo.save).not.toHaveBeenCalled();
  });

  it('rejects an imported release with no tasks', async () => {
    const { service, examRepo } = createService(CurriculumSourceKind.IMPORTED, []);

    await expect(service.startForStudent(user)).rejects.toBeInstanceOf(BadRequestException);
    expect(examRepo.save).not.toHaveBeenCalled();
  });

  it('starts a 20-task variant from the active generated catalog for a student on a demo profile', async () => {
    const currentProfile = {
      ...profile,
      curriculumReleaseId: 'old-demo-release',
      curriculumRelease: { sourceKind: CurriculumSourceKind.DEMO },
    };
    const tasks = Array.from({ length: 20 }, (_, index) => ({
      id: `task-${index}`,
      externalId: `DM-${index}`,
      topicId: `topic-${index}`,
      topic: { code: 'DM-LINEAR', title: 'Линейные уравнения' },
      taskType: 'linear_1d',
      statement: `Решите уравнение ${index} + x = ${index + 1}.`,
      acceptedAnswers: [String(index + 1)],
      solution: null,
    }));
    const release = {
      id: 'generated-release',
      sourceKind: CurriculumSourceKind.IMPORTED,
      metadata: { generatedQuestions: true },
      tasks,
    };
    const examRepo = {
      create: jest.fn((input) => ({
        id: 'exam-1',
        correctCount: 0,
        score: 0,
        status: 'in_progress',
        submittedAt: null,
        createdAt: new Date(),
        ...input,
      })),
      save: jest.fn(async (exam) => exam),
    };
    const profileRepo = {
      findOne: jest.fn().mockResolvedValue(currentProfile),
      save: jest.fn(async (value) => value),
    };
    const service = new MockExamsService(
      examRepo as any,
      { findOneBy: jest.fn().mockResolvedValue(student) } as any,
      {} as any,
      profileRepo as any,
      {} as any,
      { getActiveRelease: jest.fn().mockResolvedValue(release) } as any,
      {} as any,
    );

    const exam = await service.startForStudent(user);

    expect(exam.items).toHaveLength(20);
    expect(exam.items.every((item) => item.acceptedAnswers === undefined)).toBe(true);
    expect(profileRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ curriculumReleaseId: 'generated-release' }),
    );
  });

  it('moves an existing student profile to the current imported release and keeps every current question family', async () => {
    const currentProfile = {
      ...profile,
      curriculumReleaseId: 'old-imported-release',
      curriculumRelease: { id: 'old-imported-release', sourceKind: CurriculumSourceKind.IMPORTED },
    };
    const tasks = Array.from({ length: 21 }, (_, index) => ({
      id: `task-${index}`,
      externalId: `BANK-${index}`,
      topicId: `topic-${index}`,
      topic: { code: `Q${index + 1}`, title: `Задание ${index + 1}` },
      taskType: 'bank_task',
      difficulty: index >= 13 ? 'advanced' : 'standard',
      statement: `Задание ${index + 1}`,
      acceptedAnswers: [String(index)],
      solution: null,
      metadata: {
        examQuestionNumber: index + 1,
        examPart: index >= 13 ? 2 : 1,
        ...(index === 20 ? { isLegacy: true } : {}),
      },
    }));
    const examRepo = {
      create: jest.fn((input) => ({ id: 'exam-current', correctCount: 0, score: 0, status: 'in_progress', ...input })),
      save: jest.fn(async (exam) => exam),
    };
    const profileRepo = {
      findOne: jest.fn().mockResolvedValue(currentProfile),
      save: jest.fn(async (value) => value),
    };
    const release = { id: 'new-imported-release', sourceKind: CurriculumSourceKind.IMPORTED, tasks };
    const service = new MockExamsService(
      examRepo as any,
      { findOneBy: jest.fn().mockResolvedValue(student) } as any,
      {} as any,
      profileRepo as any,
      {} as any,
      { getActiveRelease: jest.fn().mockResolvedValue(release) } as any,
      {} as any,
    );

    const exam = await service.startForStudent(user);

    expect(exam.items).toHaveLength(20);
    expect(exam.items.map((item) => item.externalId)).not.toContain('BANK-20');
    expect(profileRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ curriculumReleaseId: 'new-imported-release' }),
    );
  });

  it('stores the written solution separately from the answer for second-part tasks', async () => {
    const exam = {
      id: 'exam-1',
      studentId: student.id,
      status: 'in_progress',
      correctCount: 0,
      score: 0,
      items: [{
        taskId: 'task-1',
        topicId: 'topic-1',
        acceptedAnswers: ['42'],
        status: 'pending',
      }],
    } as any;
    const manager = { save: jest.fn(async (value) => value) };
    const service = new MockExamsService(
      { findOne: jest.fn().mockResolvedValue(exam) } as any,
      { findOneBy: jest.fn().mockResolvedValue(student) } as any,
      {} as any,
      {} as any,
      { transaction: jest.fn(async (callback) => callback(manager)) } as any,
      {} as any,
      { recordMockEvidence: jest.fn().mockResolvedValue(undefined) } as any,
    );

    const result = await service.submit(user, 'exam-1', {
      answers: [{ taskId: 'task-1', answer: '42', work: 'Сначала вычислил значение выражения.' }],
    });

    expect(result.items[0]).toMatchObject({ answer: '42', work: 'Сначала вычислил значение выражения.', status: 'correct' });
  });

  it('copies valid curriculum image keys into the immutable mock exam snapshot', async () => {
    const tasks = Array.from({ length: 20 }, (_, index) => ({
      id: `task-${index}`,
      externalId: `BANK-${index}`,
      topicId: `topic-${index}`,
      topic: { code: 'BANK', title: 'Задания банка' },
      taskType: 'bank_task',
      difficulty: 'standard',
      statement: `Задание ${index}`,
      acceptedAnswers: [String(index)],
      solution: null,
      metadata: index === 0
        ? { imageKeys: ['curriculum/assets/mathstart/ege_profile/hash/task-0/0.webp'] }
        : index === 1
          ? { imageKeys: ['curriculum/assets/mathstart/ege_profile/hash/task-1/0.webp', 42] }
        : {},
    }));
    const examRepo = {
      create: jest.fn((input) => ({ id: 'exam-1', ...input })),
      save: jest.fn(async (exam) => exam),
    };
    const teacherUser = { id: 'teacher-user-1', role: UserRole.TEACHER } as any;
    const teacher = { id: student.teacherId } as any;
    const service = new MockExamsService(
      examRepo as any,
      { findOne: jest.fn().mockResolvedValue(student) } as any,
      { findOneBy: jest.fn().mockResolvedValue(teacher) } as any,
      { findOne: jest.fn().mockResolvedValue(profile) } as any,
      {} as any,
      { getActiveRelease: jest.fn().mockResolvedValue({ sourceKind: CurriculumSourceKind.IMPORTED, tasks }) } as any,
      {} as any,
    );

    const snapshot = await service.create(teacherUser, { studentId: student.id, examTrack: ExamTrack.EGE_PROFILE, count: 20 } as any);

    expect(snapshot.items.find((item: any) => item.taskId === 'task-0')).toMatchObject({
      imageKeys: ['curriculum/assets/mathstart/ege_profile/hash/task-0/0.webp'],
    });
    expect(snapshot.items.filter((item: any) => item.imageKeys !== undefined)).toHaveLength(1);
    expect(snapshot.items.find((item: any) => item.taskId === 'task-1')).not.toHaveProperty('imageKeys');
  });

  it('resolves an image key only for an authorized exam participant and task index', async () => {
    const exam = {
      id: 'exam-1',
      studentId: student.id,
      teacherId: student.teacherId,
      items: [{ taskId: 'task-1', imageKeys: ['curriculum/assets/mathstart/ege_profile/hash/task-1/0.webp'] }],
    } as any;
    const examRepo = { findOne: jest.fn().mockResolvedValue(exam) };
    const studentRepo = { findOneBy: jest.fn().mockImplementation(({ userId }) =>
      Promise.resolve(userId === user.id ? student : { id: 'student-2', teacherId: 'teacher-2' })) };
    const service = new MockExamsService(
      examRepo as any,
      studentRepo as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );

    await expect(service.getAuthorizedImageKey(user, 'exam-1', 'task-1', 0)).resolves.toBe(
      'curriculum/assets/mathstart/ege_profile/hash/task-1/0.webp',
    );
    await expect(service.getAuthorizedImageKey(user, 'exam-1', 'task-1', 1)).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.getAuthorizedImageKey(user, 'exam-1', 'task-1', -1)).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.getAuthorizedImageKey(user, 'exam-1', 'another-task', 0)).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.getAuthorizedImageKey({ id: 'user-2', role: UserRole.STUDENT } as any, 'exam-1', 'task-1', 0))
      .rejects.toBeInstanceOf(ForbiddenException);
  });

  it('does not resolve image keys outside the exam bank prefix', async () => {
    const exam = {
      id: 'exam-1',
      studentId: student.id,
      teacherId: student.teacherId,
      items: [{ taskId: 'task-1', imageKeys: ['other-bucket/private.webp'] }],
    } as any;
    const service = new MockExamsService(
      { findOne: jest.fn().mockResolvedValue(exam) } as any,
      { findOneBy: jest.fn().mockResolvedValue(student) } as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );

    await expect(service.getAuthorizedImageKey(user, 'exam-1', 'task-1', 0)).rejects.toBeInstanceOf(NotFoundException);
  });
});
