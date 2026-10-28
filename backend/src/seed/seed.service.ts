import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/enums/user-role.enum';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Student } from '../students/entities/student.entity';
import { RegistrationCode } from '../admin/entities/registration-code.entity';
import { CurriculumService } from '../curriculum/curriculum.service';
import { ExamTrack } from '../curriculum/entities/curriculum.entity';
import { StudentLearningProfile } from '../learning/entities/learning.entity';
import { ShowcaseSeedService } from './showcase-seed.service';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Teacher) private teacherRepo: Repository<Teacher>,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(RegistrationCode)
    private codeRepo: Repository<RegistrationCode>,
    @InjectRepository(StudentLearningProfile)
    private learningProfileRepo: Repository<StudentLearningProfile>,
    private curriculum: CurriculumService,
    private config: ConfigService,
    private readonly showcaseSeed: ShowcaseSeedService,
  ) {}

  async onModuleInit() {
    await this.bootstrapProdAdmin();
    await this.seedBuiltInMathCurricula();
    await this.showcaseSeed.seedIfEnabled();
    const enableSeed = this.config.get<boolean>('enableSeed');
    if (enableSeed) {
      const teacher = await this.seedTeacher();
      await this.seedStudent(teacher);
    }
    if (!enableSeed) return;
    await this.seedAdmin();
    await this.seedTeacherCode();
    await this.seedCurriculum();
    await this.seedLearningProfile();
  }

  private async bootstrapProdAdmin() {
    const email = this.config.get<string>('adminBootstrap.email');
    const password = this.config.get<string>('adminBootstrap.password');
    if (!email || !password) return;

    const exists = await this.userRepo.findOne({ where: { email } });
    if (exists) return;

    const user = this.userRepo.create({
      email,
      firstName: 'Admin',
      lastName: 'Platform',
      passwordHash: await bcrypt.hash(password, 12),
      role: UserRole.ADMIN,
      isEmailVerified: true,
    });
    await this.userRepo.save(user);
    this.logger.log(`Bootstrap admin created: ${email}`);
  }

  private async seedAdmin() {
    const exists = await this.userRepo.findOne({
      where: { email: 'admin@tutor.local' },
    });
    if (exists) return;

    const user = this.userRepo.create({
      email: 'admin@tutor.local',
      firstName: 'Admin',
      lastName: 'Platform',
      passwordHash: await bcrypt.hash('Admin12345', 12),
      role: UserRole.ADMIN,
      isEmailVerified: true,
    });
    await this.userRepo.save(user);
    this.logger.log('Dev admin created: admin@tutor.local');
  }

  private async seedTeacher(): Promise<Teacher> {
    let user = await this.userRepo.findOne({
      where: { email: 'teacher@tutor.local' },
    });
    const teacherUser = {
      email: 'teacher@tutor.local',
      firstName: 'Анна',
      lastName: 'Смирнова',
      passwordHash: await bcrypt.hash('Teacher12345', 12),
      role: UserRole.TEACHER,
      isEmailVerified: true,
      isBlocked: false,
    };
    user = await this.userRepo.save(
      user
        ? Object.assign(user, teacherUser)
        : this.userRepo.create(teacherUser),
    );

    let teacher = await this.teacherRepo.findOne({
      where: { userId: user.id },
    });
    if (!teacher) {
      const inviteCodeOwner = await this.teacherRepo.findOne({
        where: { inviteCode: 'DEMO1234' },
      });
      teacher = this.teacherRepo.create({
        userId: user.id,
        bio: 'Преподаватель математики и физики',
        subjects: 'Математика, Физика',
        inviteCode: inviteCodeOwner ? null : 'DEMO1234',
      });
      teacher = await this.teacherRepo.save(teacher);
    } else if (!teacher.inviteCode) {
      const inviteCodeOwner = await this.teacherRepo.findOne({
        where: { inviteCode: 'DEMO1234' },
      });
      if (!inviteCodeOwner || inviteCodeOwner.id === teacher.id) {
        teacher.inviteCode = 'DEMO1234';
        teacher = await this.teacherRepo.save(teacher);
      }
    }

    this.logger.log('Dev teacher ready: teacher@tutor.local');
    return teacher;
  }

  private async seedStudent(teacher: Teacher | null) {
    let user = await this.userRepo.findOne({
      where: { email: 'student@tutor.local' },
    });
    const studentUser = {
      email: 'student@tutor.local',
      firstName: 'Иван',
      lastName: 'Иванов',
      passwordHash: await bcrypt.hash('Student12345', 12),
      role: UserRole.STUDENT,
      isEmailVerified: true,
      isBlocked: false,
    };
    user = await this.userRepo.save(
      user
        ? Object.assign(user, studentUser)
        : this.userRepo.create(studentUser),
    );

    let student = await this.studentRepo.findOne({
      where: { userId: user.id },
    });
    if (!student) {
      student = this.studentRepo.create({
        userId: user.id,
        teacherId: teacher?.id ?? null,
      });
      await this.studentRepo.save(student);
    } else if (teacher && student.teacherId !== teacher.id) {
      student.teacherId = teacher.id;
      await this.studentRepo.save(student);
    }
    this.logger.log('Dev student ready: student@tutor.local');
  }

  private async seedTeacherCode() {
    const exists = await this.codeRepo.findOne({
      where: { code: 'NEWTEACHER' },
    });
    if (exists) return;

    const code = this.codeRepo.create({
      code: 'NEWTEACHER',
      expiresAt: new Date(Date.now() + 365 * 24 * 3600 * 1000),
    });
    await this.codeRepo.save(code);
    this.logger.log('Dev teacher registration code: NEWTEACHER');
  }

  private async seedCurriculum() {
    await this.curriculum.importDemo(false);
    this.logger.log('Inactive demo curricula imported for all math exam tracks');
  }

  private async seedBuiltInMathCurricula() {
    const results = await this.curriculum.importDeepMindCurricula();
    const taskCount = results.reduce<number>(
      (sum, result: any) => sum + Number(result.taskCount ?? 0),
      0,
    );
    this.logger.log(
      `Built-in DeepMind math bank is ready (${taskCount} tasks across 3 tracks)`,
    );
  }

  private async seedLearningProfile() {
    const user = await this.userRepo.findOne({
      where: { email: 'student@tutor.local' },
    });
    if (!user) return;
    const student = await this.studentRepo.findOne({
      where: { userId: user.id },
    });
    if (!student) return;
    const exists = await this.learningProfileRepo.findOne({
      where: { studentId: student.id },
    });
    if (exists) return;
    const release = await this.curriculum.getActiveRelease(
      ExamTrack.EGE_PROFILE,
    );
    await this.learningProfileRepo.save(
      this.learningProfileRepo.create({
        studentId: student.id,
        examTrack: ExamTrack.EGE_PROFILE,
        curriculumReleaseId: release.id,
        targetScore: 80,
      }),
    );
    this.logger.log('Demo learning profile created for student@tutor.local');
  }
}
