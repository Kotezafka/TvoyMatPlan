import { FamilyService } from './family.service';
import { BookingStatus } from '../bookings/entities/booking.entity';

describe('FamilyService', () => {
  it('returns the same permanent family link every time', async () => {
    const student = {
      id: 'student-id',
      userId: 'student-user-id',
      familyAccessTokenHash: null,
      familyAccessTokenCipherText: null,
      familyAccessTokenHashes: [],
      familyAccessTokenExpires: null,
    };
    const studentRepo = {
      findOne: jest.fn().mockResolvedValue(student),
      save: jest.fn(async (value) => value),
    };
    const config = { get: jest.fn(() => 'family-link-test-secret') };
    const service = new FamilyService(
      studentRepo as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      config as any,
    );

    const first = await service.createAccess(
      { id: 'student-user-id', role: 'student' } as any,
      'https://easyphys.ru',
    );
    const second = await service.createAccess(
      { id: 'student-user-id', role: 'student' } as any,
      'https://easyphys.ru',
    );
    const reloaded = await service.getAccess(
      { id: 'student-user-id', role: 'student' } as any,
      'https://easyphys.ru',
    );

    expect(first.url).toBe(second.url);
    expect(reloaded.url).toBe(first.url);
    expect(reloaded.hasExistingLink).toBe(true);
    expect(first.expiresAt).toBeNull();
    expect(studentRepo.save).toHaveBeenCalledTimes(1);
    expect(student.familyAccessTokenExpires).toBeNull();
  });

  it('accepts a signed permanent link without a stored expiry', async () => {
    const student = {
      id: 'student-id',
      userId: 'student-user-id',
      familyAccessTokenHash: null as string | null,
      familyAccessTokenCipherText: null as string | null,
      familyAccessTokenHashes: [] as string[],
      familyAccessTokenExpires: null,
    };
    let requestedHash: string | null = null;
    const queryBuilder: any = {
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn((_sql, params) => {
        requestedHash = params.hash;
        return queryBuilder;
      }),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockImplementation(() =>
        requestedHash === student.familyAccessTokenHash ||
        student.familyAccessTokenHashes.includes(requestedHash ?? '')
          ? student
          : null,
      ),
    };
    const studentRepo = {
      findOne: jest.fn().mockResolvedValue(student),
      save: jest.fn(async (value) => value),
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
    };
    const config = { get: jest.fn(() => 'family-link-test-secret') };
    const service = new FamilyService(
      studentRepo as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      config as any,
    );
    const { token } = await service.createAccess(
      { id: 'student-user-id', role: 'student' } as any,
      'https://easyphys.ru',
    );

    await expect((service as any).familyStudent(token)).resolves.toBe(student);
    expect(studentRepo.createQueryBuilder).toHaveBeenCalledWith('student');
    expect(queryBuilder.where).toHaveBeenCalledWith(
      expect.stringContaining('familyAccessTokenHashes'),
      expect.objectContaining({ hash: expect.any(String) }),
    );
    expect(requestedHash).toBe(student.familyAccessTokenHash);
  });

  it('keeps previously shared random links valid past their old expiry', async () => {
    const token = 'a-valid-family-access-token-with-more-than-thirty-characters';
    const student = {
      id: 'student-id',
      familyAccessTokenExpires: new Date(Date.now() - 86_400_000),
    };
    const queryBuilder = {
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(student),
    };
    const studentRepo = {
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
    };
    const service = new FamilyService(
      studentRepo as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      { get: jest.fn(() => 'family-link-test-secret') } as any,
    );

    await expect((service as any).familyStudent(token)).resolves.toBe(student);
    expect(queryBuilder.where.mock.calls[0][0]).not.toContain('familyAccessTokenExpires');
    expect(queryBuilder.where.mock.calls[0][1].hash).toBeTruthy();
  });

  it('saves normalized report questions through the family access token', async () => {
    const student = {
      id: 'student-id',
      parentReportQuestions: [] as string[],
      familyAccessTokenExpires: new Date(Date.now() + 60_000),
    };
    const queryBuilder = {
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(student),
    };
    const studentRepo = {
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
      save: jest.fn(async (value) => value),
    };
    const service = new FamilyService(
      studentRepo as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      { get: jest.fn(() => 'family-link-test-secret') } as any,
    );

    const result = await (service as any).updateReportSettings(
      'a-valid-family-access-token-with-more-than-thirty-characters',
      ['  Что ученик понял лучше всего?  ', '', 'Что ученик понял лучше всего?'],
    );

    expect(result).toEqual({ parentReportQuestions: ['Что ученик понял лучше всего?'] });
    expect(studentRepo.save).toHaveBeenCalledWith(student);
    expect(studentRepo.createQueryBuilder).toHaveBeenCalled();
  });

  it('shows every booked lesson, including visits without a lesson report', async () => {
    const today = Date.now();
    const bookings = [
      {
        id: 'visited-booking',
        status: BookingStatus.COMPLETED,
        slot: {
          startTime: new Date(today - 2 * 24 * 60 * 60_000),
          note: 'Уравнения',
          lesson: {
            id: 'visited-lesson',
            status: 'completed',
            startedAt: new Date(today - 2 * 24 * 60 * 60_000),
            participantCount: 0,
        report: { summary: 'Повторили уравнения', parentAnswers: [] },
          },
        },
      },
      {
        id: 'missed-booking',
        status: BookingStatus.COMPLETED,
        slot: {
          startTime: new Date(today - 24 * 60 * 60_000),
          note: 'Геометрия',
          lesson: undefined,
        },
      },
      {
        id: 'upcoming-booking',
        status: BookingStatus.CONFIRMED,
        slot: {
          startTime: new Date(today + 24 * 60 * 60_000),
          note: 'Вероятность',
          lesson: undefined,
        },
      },
    ];
    const bookingRepo = { find: jest.fn().mockResolvedValue(bookings) };
    const service = new FamilyService(
      {} as any,
      bookingRepo as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );

    const result = await (service as any).lessons('student-id');

    expect(bookingRepo.find).toHaveBeenCalledWith(
      expect.objectContaining({
        relations: ['slot', 'slot.lesson'],
        take: 200,
      }),
    );
    expect(result).toHaveLength(3);
    expect(result.map((item: any) => item.id)).toEqual([
      'upcoming-booking',
      'missed-booking',
      'visited-booking',
    ]);
    expect(result.find((item: any) => item.id === 'visited-booking')).toEqual(
      expect.objectContaining({
        lessonId: 'visited-lesson',
        attendanceStatus: 'attended',
            report: { summary: 'Повторили уравнения', parentAnswers: [] },
      }),
    );
    expect(result.find((item: any) => item.id === 'missed-booking')).toEqual(
      expect.objectContaining({
        lessonId: null,
        attendanceStatus: 'not_attended',
        report: null,
      }),
    );
    expect(result.find((item: any) => item.id === 'upcoming-booking')).toEqual(
      expect.objectContaining({
        attendanceStatus: 'scheduled',
        report: null,
      }),
    );
  });

  it('returns only this family’s configured answers in lesson reports', () => {
    const service = new FamilyService(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );

    const report = (service as any).reportForFamily(
      {
        summary: 'Повторили уравнения',
        parentAnswers: [
          { question: 'Как справился с уравнениями?', answer: 'Хорошо.' },
          { question: 'Что повторить?', answer: 'Дроби.' },
        ],
      },
      ['Что повторить?'],
    );

    expect(report.parentAnswers).toEqual([
      { question: 'Что повторить?', answer: 'Дроби.' },
    ]);
  });

  it('keeps family messages scoped to the teacher-owned student', async () => {
    const message = {
      id: 'message-id',
      senderType: 'teacher',
      senderName: 'Анна Учитель',
      body: 'До встречи на уроке',
      createdAt: new Date('2026-10-11T10:00:00Z'),
    };
    const messageRepo = {
      create: jest.fn().mockReturnValue(message),
      save: jest.fn().mockResolvedValue(message),
    };
    const notifications = { notifyFamilyMessage: jest.fn().mockResolvedValue(undefined) };
    const studentRepo = {
      findOne: jest.fn().mockResolvedValue({
        id: 'student-id',
        teacherId: 'teacher-id',
        teacher: { userId: 'teacher-user-id' },
        userId: 'student-user-id',
        parentEmail: 'parent@example.com',
      }),
    };
    const service = new FamilyService(
      studentRepo as any,
      {} as any,
      {} as any,
      messageRepo as any,
      {} as any,
      {} as any,
      notifications as any,
      { get: jest.fn(() => 'family-link-test-secret') } as any,
    );

    const result = await service.sendTeacherMessage(
      {
        id: 'teacher-user-id',
        role: 'teacher',
        firstName: 'Анна',
        lastName: 'Учитель',
      } as any,
      'student-id',
      '  До встречи на уроке  ',
    );

    expect(result).toEqual(message);
    expect(messageRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        studentId: 'student-id',
        teacherId: 'teacher-id',
        senderType: 'teacher',
        body: 'До встречи на уроке',
      }),
    );
    expect(notifications.notifyFamilyMessage).toHaveBeenCalledWith(
      'student-user-id',
      'parent@example.com',
      'преподавателя',
      'message-id',
    );
  });
});
