import { SHOWCASE_FAMILY_TOKEN, ShowcaseSeedService } from './showcase-seed.service';
import { Booking } from '../bookings/entities/booking.entity';
import { CalendarSlot } from '../calendar/entities/calendar-slot.entity';
import { CurriculumRelease, CurriculumTask, CurriculumTopic } from '../curriculum/entities/curriculum.entity';
import { LearningEvidence, LessonLearningReview, LessonTopicFinding, StudentLearningProfile, StudentMistake, StudentTopicProgress, HomeworkAssignment, HomeworkItem } from '../learning/entities/learning.entity';
import { Lesson } from '../lessons/entities/lesson.entity';
import { MockExam } from '../mock-exams/entities/mock-exam.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { User } from '../users/entities/user.entity';
import {
  decryptFamilyAccessToken,
  hashFamilyAccessToken,
} from '../family/family-access-token';

function createHarness(enabled = true) {
  const topics = Array.from({ length: 8 }, (_, index) => ({
    id: `topic-${index + 1}`,
    code: `T${index + 1}`,
    title: ['Уравнения', 'Функции', 'Геометрия', 'Производная', 'Вероятность', 'Текстовые задачи', 'Тригонометрия', 'Планиметрия'][index],
    section: 'Демонстрационная программа',
    position: index + 1,
  }));
  const tasks = Array.from({ length: 32 }, (_, index) => ({
    id: `task-${index + 1}`,
    releaseId: 'release-demo',
    topicId: topics[index % topics.length].id,
    externalId: `DEMO-${index + 1}`,
    statement: `Демонстрационная задача ${index + 1}`,
    acceptedAnswers: ['2'],
    solution: 'Пошаговое решение демонстрационной задачи.',
    taskType: `Тип ${(index % 4) + 1}`,
    difficulty: 'standard',
  }));
  const entities = [
    User, Teacher, Student, CalendarSlot, Booking, Lesson, Payment, MockExam,
    StudentLearningProfile, CurriculumRelease, CurriculumTopic, CurriculumTask,
    LearningEvidence, StudentTopicProgress, LessonLearningReview,
    LessonTopicFinding, StudentMistake, HomeworkAssignment, HomeworkItem,
  ];
  const tables = new Map<any, any[]>(entities.map((entity) => [entity, []]));
  tables.get(CurriculumRelease)!.push({
    id: 'release-demo',
    examTrack: 'ege_profile',
    isActive: true,
    year: 2026,
  });
  let id = 0;
  const repositories = new Map<any, any>();
  for (const entity of entities) {
    const rows = tables.get(entity)!;
    repositories.set(entity, {
      create: jest.fn((input) => ({ ...input })),
      findOne: jest.fn(async ({ where }: any) => rows.find((row) =>
        Object.entries(where ?? {}).every(([key, value]) => row[key] === value),
      ) ?? null),
      find: jest.fn(async () => entity === CurriculumTopic ? topics : entity === CurriculumTask ? tasks : entity === LearningEvidence ? rows : []),
      save: jest.fn(async (input: any) => {
        const saveOne = (record: any) => {
          if (!record.id) record.id = `record-${++id}`;
          const existing = rows.findIndex((row) => row.id === record.id);
          if (existing < 0) rows.push(record);
          else rows[existing] = record;
          return record;
        };
        return Array.isArray(input) ? input.map(saveOne) : saveOne(input);
      }),
    });
  }
  const manager = {
    getRepository: (entity: any) => repositories.get(entity),
  };
  const dataSource = {
    transaction: jest.fn((callback: (value: any) => unknown) => callback(manager)),
  };
  const config = {
    get: jest.fn((key: string) => ({
      enableDemoAccounts: enabled,
      'showcase.teacherEmail': 'demo.teacher@easyphys.ru',
      'showcase.teacherPassword': 'DemoTeacher2026!',
      'showcase.studentEmail': 'demo.student@easyphys.ru',
      'showcase.studentPassword': 'DemoStudent2026!',
      'jwt.secret': 'showcase-test-secret',
    } as Record<string, unknown>)[key]),
  };
  return { service: new ShowcaseSeedService(dataSource as any, config as any), tables, repositories, dataSource };
}

describe('ShowcaseSeedService', () => {
  it('creates linked teacher and student accounts with substantial demo history once', async () => {
    const { service, tables, dataSource } = createHarness();

    await service.seedIfEnabled();
    await service.seedIfEnabled();

    const users = tables.get(User)!;
    const teacher = users.find((user) => user.role === 'teacher');
    const studentUser = users.find((user) => user.role === 'student');
    const teacherProfile = tables.get(Teacher)![0];
    const student = tables.get(Student)![0];
    expect(teacher.email).toBe('demo.teacher@easyphys.ru');
    expect(studentUser.email).toBe('demo.student@easyphys.ru');
    expect(student.teacherId).toBe(teacherProfile.id);
    expect(student.parentName).toBe('Мария (демо)');
    expect(student.parentEmail).toBeNull();
    expect(student.familyAccessTokenHash).toHaveLength(64);
    expect(student.familyAccessTokenHash).toBe(hashFamilyAccessToken(SHOWCASE_FAMILY_TOKEN));
    expect(decryptFamilyAccessToken(student.familyAccessTokenCipherText, 'showcase-test-secret'))
      .toBe(SHOWCASE_FAMILY_TOKEN);
    expect(student.familyAccessTokenExpires).toBeNull();
    expect(tables.get(Lesson)).toHaveLength(12);
    expect(tables.get(CalendarSlot)).toHaveLength(18);
    expect(tables.get(Booking)).toHaveLength(15);
    expect(tables.get(LessonLearningReview)).toHaveLength(12);
    expect(tables.get(HomeworkAssignment)).toHaveLength(8);
    expect(tables.get(Payment)).toHaveLength(8);
    expect(tables.get(MockExam)).toHaveLength(2);
    expect(tables.get(LearningEvidence)!.length).toBeGreaterThan(30);
    expect(dataSource.transaction).toHaveBeenCalledTimes(2);
  });

  it('does not open a database transaction when showcase accounts are disabled', async () => {
    const { service, dataSource } = createHarness(false);

    await service.seedIfEnabled();

    expect(dataSource.transaction).not.toHaveBeenCalled();
  });

  it('does not replace an existing family link when demo data is reseeded', async () => {
    const { service, tables } = createHarness();
    await service.seedIfEnabled();
    const student = tables.get(Student)![0];
    student.familyAccessTokenHash = 'a'.repeat(64);
    student.familyAccessTokenCipherText = 'existing-encrypted-token';
    student.familyAccessTokenHashes = ['legacy-hash'];
    student.familyAccessTokenExpires = null;

    await service.seedIfEnabled();

    expect(student.familyAccessTokenHash).toBe('a'.repeat(64));
    expect(student.familyAccessTokenCipherText).toBe('existing-encrypted-token');
    expect(student.familyAccessTokenHashes).toEqual(['legacy-hash']);
  });
});
