import { SeedService } from './seed.service';

describe('SeedService', () => {
  it('creates a linked demo teacher and student when demo accounts are enabled', async () => {
    const curriculum = {
      importDeepMindCurricula: jest.fn().mockResolvedValue([]),
      importDemo: jest.fn().mockResolvedValue(undefined),
      getActiveRelease: jest
        .fn()
        .mockResolvedValue({ id: 'demo-curriculum-release-id' }),
    };
    const config = {
      get: jest.fn((key: string) =>
        key === 'enableSeed' ? true : undefined,
      ),
    };
    const users = new Map<string, any>();
    const userRepository = {
      findOne: jest.fn(async ({ where: { email } }: any) => users.get(email)),
      create: jest.fn((record) => record),
      save: jest.fn(async (record) => {
        const user = {
          ...record,
          id:
            record.role === 'teacher' ? 'teacher-user-id' : 'student-user-id',
        };
        users.set(user.email, user);
        return user;
      }),
    };
    let demoTeacher: any;
    const teacherRepository = {
      findOne: jest.fn(async ({ where }) => {
        if (where.userId === 'teacher-user-id') return demoTeacher;
        if (where.inviteCode === 'DEMO1234') return demoTeacher;
        return undefined;
      }),
      create: jest.fn((record) => record),
      save: jest.fn(async (record) => {
        demoTeacher = { ...record, id: 'demo-teacher-id' };
        return demoTeacher;
      }),
    };
    let demoStudent: any;
    const studentRepository = {
      findOne: jest.fn(async () => demoStudent),
      create: jest.fn((record) => record),
      save: jest.fn(async (record) => {
        demoStudent = { ...record, id: 'demo-student-id' };
        return demoStudent;
      }),
    };
    const codeRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };
    const learningProfileRepository = {
      findOne: jest.fn().mockResolvedValue(undefined),
      create: jest.fn(),
      save: jest.fn(),
    };
    const service = new SeedService(
      userRepository as any,
      teacherRepository as any,
      studentRepository as any,
      codeRepository as any,
      learningProfileRepository as any,
      curriculum as any,
      config as any,
      { seedIfEnabled: jest.fn() } as any,
    );

    await service.onModuleInit();

    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'teacher@tutor.local',
        role: 'teacher',
        isEmailVerified: true,
      }),
    );
    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'student@tutor.local',
        role: 'student',
        isEmailVerified: true,
      }),
    );
    expect(studentRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'student-user-id',
        teacherId: 'demo-teacher-id',
      }),
    );

    users.get('teacher@tutor.local').isBlocked = true;
    await service.onModuleInit();

    expect(userRepository.save).toHaveBeenCalledTimes(5);
    expect(users.get('teacher@tutor.local').isBlocked).toBe(false);
    expect(users.get('student@tutor.local').isBlocked).toBe(false);
    expect(demoStudent.teacherId).toBe('demo-teacher-id');
  });

  it('loads the built-in math bank when optional demo account seeds are disabled', async () => {
    const curriculum = { importDeepMindCurricula: jest.fn().mockResolvedValue([]) };
    const config = {
      get: jest.fn((key: string) => (key === 'enableSeed' ? false : undefined)),
    };
    const repositories = Array.from({ length: 5 }, () => ({
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    }));
    const service = new SeedService(
      repositories[0] as any,
      repositories[1] as any,
      repositories[2] as any,
      repositories[3] as any,
      repositories[4] as any,
      curriculum as any,
      config as any,
      { seedIfEnabled: jest.fn() } as any,
    );

    await service.onModuleInit();

    expect(curriculum.importDeepMindCurricula).toHaveBeenCalledTimes(1);
    expect(repositories[0].findOne).not.toHaveBeenCalled();
  });
});
