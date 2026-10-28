import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Booking, BookingStatus } from '../bookings/entities/booking.entity';
import { CalendarSlot, LessonType, SlotStatus } from '../calendar/entities/calendar-slot.entity';
import { CurriculumRelease, CurriculumTask, CurriculumTopic, ExamTrack } from '../curriculum/entities/curriculum.entity';
import { calculateMastery } from '../learning/learning.algorithms';
import {
  HomeworkAssignment,
  HomeworkItem,
  HomeworkItemStatus,
  HomeworkStatus,
  LearningEvidence,
  LearningEvidenceSource,
  LessonLearningReview,
  LessonReviewStatus,
  LessonTopicFinding,
  StudentLearningProfile,
  StudentMistake,
  StudentTopicProgress,
  TopicAssessment,
} from '../learning/entities/learning.entity';
import { Lesson, LessonEndReason, LessonStatus } from '../lessons/entities/lesson.entity';
import { MockExam as MockExamEntity, MockExamStatus } from '../mock-exams/entities/mock-exam.entity';
import { Payment, PaymentStatus } from '../payments/entities/payment.entity';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/enums/user-role.enum';
import {
  encryptFamilyAccessToken,
  hashFamilyAccessToken,
} from '../family/family-access-token';

const HISTORY_COUNT = 12;
const HOMEWORK_COUNT = 8;
const FUTURE_BOOKING_COUNT = 3;
const FREE_SLOT_COUNT = 3;
export const SHOWCASE_FAMILY_TOKEN = 'easyphys-showcase-family-access-v1-2026';

type ShowcaseCredentials = {
  teacherEmail: string;
  teacherPassword: string;
  studentEmail: string;
  studentPassword: string;
};

@Injectable()
export class ShowcaseSeedService {
  private readonly logger = new Logger(ShowcaseSeedService.name);

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly config: ConfigService,
  ) {}

  async seedIfEnabled() {
    if (!this.config.get<boolean>('enableDemoAccounts')) return;

    const credentials = this.credentials();
    await this.dataSource.transaction((manager) =>
      this.seedShowcase(manager, credentials),
    );
    this.logger.log('Teacher and student showcase accounts are ready');
  }

  private credentials(): ShowcaseCredentials {
    const credentials = {
      teacherEmail: this.config.get<string>('showcase.teacherEmail'),
      teacherPassword: this.config.get<string>('showcase.teacherPassword'),
      studentEmail: this.config.get<string>('showcase.studentEmail'),
      studentPassword: this.config.get<string>('showcase.studentPassword'),
    };
    if (
      !credentials.teacherEmail || credentials.teacherPassword.length < 12 ||
      !credentials.studentEmail || credentials.studentPassword.length < 12
    ) {
      throw new Error('Demo showcase account emails and 12-character passwords are required');
    }
    if (credentials.teacherEmail === credentials.studentEmail) {
      throw new Error('Showcase teacher and student must use different emails');
    }
    return credentials;
  }

  private async seedShowcase(
    manager: EntityManager,
    credentials: ShowcaseCredentials,
  ) {
    const users = manager.getRepository(User);
    const teachers = manager.getRepository(Teacher);
    const students = manager.getRepository(Student);
    const slots = manager.getRepository(CalendarSlot);
    const bookings = manager.getRepository(Booking);
    const lessons = manager.getRepository(Lesson);
    const payments = manager.getRepository(Payment);
    const profiles = manager.getRepository(StudentLearningProfile);
    const releases = manager.getRepository(CurriculumRelease);
    const topicsRepository = manager.getRepository(CurriculumTopic);
    const tasksRepository = manager.getRepository(CurriculumTask);
    const evidenceRepository = manager.getRepository(LearningEvidence);
    const progressRepository = manager.getRepository(StudentTopicProgress);
    const reviews = manager.getRepository(LessonLearningReview);
    const findings = manager.getRepository(LessonTopicFinding);
    const mistakes = manager.getRepository(StudentMistake);
    const assignments = manager.getRepository(HomeworkAssignment);
    const items = manager.getRepository(HomeworkItem);
    const exams = manager.getRepository(MockExamEntity);

    const teacherUser = await this.ensureUser(
      users,
      credentials.teacherEmail,
      credentials.teacherPassword,
      UserRole.TEACHER,
      'Анна (демо)',
      'Смирнова',
    );
    const studentUser = await this.ensureUser(
      users,
      credentials.studentEmail,
      credentials.studentPassword,
      UserRole.STUDENT,
      'Илья (демо)',
      'Ковалёв',
    );
    const teacher = await this.ensureTeacher(teachers, teacherUser.id);
    const student = await this.ensureStudent(students, studentUser.id, teacher.id);

    const release = await releases.findOne({
      where: { examTrack: ExamTrack.EGE_PROFILE, isActive: true },
      order: { year: 'DESC' },
    });
    if (!release) throw new Error('An active profile EGE curriculum is required for showcase data');
    const [topics, tasks] = await Promise.all([
      topicsRepository.find({ where: { releaseId: release.id }, order: { position: 'ASC' } }),
      tasksRepository.find({ where: { releaseId: release.id }, order: { externalId: 'ASC' } }),
    ]);
    if (topics.length < 2 || tasks.length < 8) {
      throw new Error('The active curriculum must contain at least 2 topics and 8 tasks for showcase data');
    }

    await this.ensureLearningProfile(profiles, student.id, release.id);
    for (let index = 0; index < HISTORY_COUNT; index += 1) {
      await this.ensureHistoricalLesson({
        teacherUserId: teacherUser.id,
        teacherId: teacher.id,
        studentId: student.id,
        index,
        topics,
        tasks,
        repositories: {
          slots,
          bookings,
          lessons,
          evidenceRepository,
          reviews,
          findings,
          mistakes,
          assignments,
          items,
        },
      });
    }
    await this.ensureUpcomingSlots(slots, bookings, teacher.id, student.id);
    await this.ensurePayments(payments, teacher.id, student.id);
    await this.ensureMockExams(
      exams,
      evidenceRepository,
      teacher.id,
      student.id,
      topics,
      tasks,
    );
    await this.rebuildProgress(progressRepository, evidenceRepository, student.id, topics);
  }

  private async ensureUser(
    repository: Repository<User>,
    email: string,
    password: string,
    role: UserRole,
    firstName: string,
    lastName: string,
  ) {
    let user = await repository.findOne({ where: { email } });
    if (user && user.role !== role) {
      throw new Error(`Showcase email ${email} is already assigned to another role`);
    }
    if (!user) {
      user = repository.create({
        email,
        firstName,
        lastName,
        passwordHash: await bcrypt.hash(password, 12),
        role,
        isEmailVerified: true,
        isBlocked: false,
      });
    } else {
      user.firstName = firstName;
      user.lastName = lastName;
      user.passwordHash = await bcrypt.hash(password, 12);
      user.isEmailVerified = true;
      user.isBlocked = false;
    }
    return repository.save(user);
  }

  private async ensureTeacher(repository: Repository<Teacher>, userId: string) {
    let teacher = await repository.findOne({ where: { userId } });
    if (!teacher) {
      teacher = repository.create({
        userId,
        bio: 'Демонстрационный преподаватель математики. Здесь показаны расписание, отчёты и динамика обучения.',
        subjects: 'Математика, подготовка к ЕГЭ',
        inviteCode: null,
      });
      teacher = await repository.save(teacher);
    }
    return teacher;
  }

  private async ensureStudent(
    repository: Repository<Student>,
    userId: string,
    teacherId: string,
  ) {
    let student = await repository.findOne({ where: { userId } });
    if (!student) {
      student = repository.create({
        userId,
        teacherId,
        parentName: 'Мария (демо)',
        parentEmail: null,
        parentReportQuestions: [
          'Что ученик понял лучше всего?',
          'Что стоит повторить до следующего занятия?',
        ],
      });
    } else {
      student.teacherId = teacherId;
      student.parentName ??= 'Мария (демо)';
      student.parentReportQuestions ??= [];
    }
    student.parentEmail = null;
    const showcaseTokenHash = hashFamilyAccessToken(SHOWCASE_FAMILY_TOKEN);
    if (!student.familyAccessTokenHash || student.familyAccessTokenHash === showcaseTokenHash) {
      student.familyAccessTokenHash = showcaseTokenHash;
      student.familyAccessTokenCipherText = encryptFamilyAccessToken(
        SHOWCASE_FAMILY_TOKEN,
        this.config.get<string>('jwt.secret') || 'dev-secret',
      );
      student.familyAccessTokenHashes = [];
      student.familyAccessTokenExpires = null;
    }
    return repository.save(student);
  }

  private async ensureLearningProfile(
    repository: Repository<StudentLearningProfile>,
    studentId: string,
    releaseId: string,
  ) {
    const profile = await repository.findOne({ where: { studentId } });
    if (profile) return;
    await repository.save(repository.create({
      studentId,
      examTrack: ExamTrack.EGE_PROFILE,
      curriculumReleaseId: releaseId,
      targetScore: 80,
    }));
  }

  private async ensureHistoricalLesson(input: {
    teacherUserId: string;
    teacherId: string;
    studentId: string;
    index: number;
    topics: CurriculumTopic[];
    tasks: CurriculumTask[];
    repositories: {
      slots: Repository<CalendarSlot>;
      bookings: Repository<Booking>;
      lessons: Repository<Lesson>;
      evidenceRepository: Repository<LearningEvidence>;
      reviews: Repository<LessonLearningReview>;
      findings: Repository<LessonTopicFinding>;
      mistakes: Repository<StudentMistake>;
      assignments: Repository<HomeworkAssignment>;
      items: Repository<HomeworkItem>;
    };
  }) {
    const marker = `showcase-${input.teacherId}-${input.studentId}-lesson-${String(input.index + 1).padStart(2, '0')}`;
    if (await input.repositories.lessons.findOne({ where: { roomName: marker } })) return;

    const firstTopic = input.topics[input.index % input.topics.length];
    const secondTopic = input.topics[(input.index + 1) % input.topics.length];
    const assessment = this.assessmentFor(input.index);
    const startAt = this.dateAtUtcDaysFromNow(-84 + input.index * 7, 15);
    const note = `${firstTopic.title}: ${this.lessonSuffix(input.index)}`;
    const slot = await input.repositories.slots.save(input.repositories.slots.create({
      teacherId: input.teacherId,
      startTime: startAt,
      endTime: new Date(startAt.getTime() + 60 * 60_000),
      status: SlotStatus.BOOKED,
      lessonType: LessonType.INDIVIDUAL,
      capacity: 1,
      bookedCount: 1,
      note,
    }));
    await input.repositories.bookings.save(input.repositories.bookings.create({
      studentId: input.studentId,
      slotId: slot.id,
      status: BookingStatus.COMPLETED,
      isRecurring: true,
    }));
    const report = {
      summary: `На занятии разобрали тему «${firstTopic.title}», выполнили задания разного уровня и закрепили алгоритм решения.`,
      topics: [firstTopic.title, secondTopic.title],
      achievements: [
        `Самостоятельно решил(а) несколько задач по теме «${firstTopic.title}».`,
        'Объяснил(а) ход решения и проверил(а) ответ.',
      ],
      difficulties: assessment === TopicAssessment.DIFFICULTY
        ? [`Пока требует практики тема «${secondTopic.title}».`]
        : [],
      homework: ['Выполнить 4 задания на закрепление темы урока.'],
      recommendations: ['Перед следующим занятием повторить алгоритм и разобрать одну задачу повышенной сложности.'],
      keyMoments: [
        { time: '00:12', description: `Разобрали ключевой приём по теме «${firstTopic.title}».` },
        { time: '00:38', description: 'Ученик самостоятельно решил задачу и проверил результат.' },
      ],
      parentAnswers: [
        { question: 'Что ученик понял лучше всего?', answer: `Ученик уверенно применяет основные приёмы по теме «${firstTopic.title}».` },
        { question: 'Что стоит повторить до следующего занятия?', answer: `Коротко повторить тему «${secondTopic.title}» и выполнить выданные задания.` },
      ],
    };
    const lesson = await input.repositories.lessons.save(input.repositories.lessons.create({
      slotId: slot.id,
      teacherId: input.teacherId,
      roomName: marker,
      status: LessonStatus.COMPLETED,
      participantCount: 2,
      startedAt: startAt,
      endedAt: new Date(startAt.getTime() + 50 * 60_000),
      endReason: LessonEndReason.TEACHER,
      transcriptLanguage: 'ru',
      transcriptDurationSeconds: 50 * 60,
      report,
    }));
    const review = await input.repositories.reviews.save(input.repositories.reviews.create({
      lessonId: lesson.id,
      studentId: input.studentId,
      status: LessonReviewStatus.PUBLISHED,
      summary: report.summary,
      achievements: report.achievements,
      recommendations: report.recommendations,
      rawTopics: report.topics,
      rawDifficulties: report.difficulties,
      revision: 1,
      publishedByUserId: input.teacherUserId,
      publishedAt: new Date(startAt.getTime() + 55 * 60_000),
      createdAt: new Date(startAt.getTime() + 50 * 60_000),
    }));

    const topicFindings = [firstTopic, secondTopic].map((topic, topicIndex) => ({
      reviewId: review.id,
      topicId: topic.id,
      assessment: topicIndex === 0 ? assessment : this.assessmentFor(input.index + 1),
      confidence: 0.78 + ((input.index + topicIndex) % 3) * 0.07,
      note: topicIndex === 0 ? 'Основная тема занятия' : 'Закрепление и перенос навыка',
    }));
    const savedFindings = await input.repositories.findings.save(
      topicFindings.map((finding) => input.repositories.findings.create(finding)),
    );
    await input.repositories.evidenceRepository.save(savedFindings.map((finding) =>
      input.repositories.evidenceRepository.create({
        studentId: input.studentId,
        topicId: finding.topicId,
        sourceType: LearningEvidenceSource.LESSON,
        sourceId: lesson.id,
        score: this.assessmentScore(finding.assessment),
        weight: finding.confidence,
        createdAt: startAt,
      }),
    ));
    if (input.index === 3 || input.index === 8) {
      await input.repositories.mistakes.save(input.repositories.mistakes.create({
        reviewId: review.id,
        studentId: input.studentId,
        topicId: secondTopic.id,
        description: `Проверять знак при переходе в следующую строку в заданиях по теме «${secondTopic.title}».`,
        resolved: input.index === 8,
        resolvedAt: input.index === 8 ? new Date(startAt.getTime() + 7 * 86_400_000) : null,
        createdAt: startAt,
      }));
    }
    if (input.index < HOMEWORK_COUNT) {
      await this.ensureHomework({
        index: input.index,
        lessonId: lesson.id,
        reviewId: review.id,
        studentId: input.studentId,
        startAt,
        tasks: input.tasks,
        assignments: input.repositories.assignments,
        items: input.repositories.items,
        evidence: input.repositories.evidenceRepository,
      });
    }
  }

  private async ensureHomework(input: {
    index: number;
    lessonId: string;
    reviewId: string;
    studentId: string;
    startAt: Date;
    tasks: CurriculumTask[];
    assignments: Repository<HomeworkAssignment>;
    items: Repository<HomeworkItem>;
    evidence: Repository<LearningEvidence>;
  }) {
    if (await input.assignments.findOne({ where: { reviewId: input.reviewId } })) return;
    const homeworkStatus = [
      HomeworkStatus.COMPLETED,
      HomeworkStatus.COMPLETED,
      HomeworkStatus.COMPLETED,
      HomeworkStatus.IN_PROGRESS,
      HomeworkStatus.IN_PROGRESS,
      HomeworkStatus.PUBLISHED,
      HomeworkStatus.COMPLETED,
      HomeworkStatus.PUBLISHED,
    ][input.index];
    const now = new Date();
    const isCompleted = homeworkStatus === HomeworkStatus.COMPLETED;
    const assignment = await input.assignments.save(input.assignments.create({
      reviewId: input.reviewId,
      lessonId: input.lessonId,
      studentId: input.studentId,
      status: homeworkStatus,
      dueAt: isCompleted
        ? new Date(input.startAt.getTime() + 8 * 86_400_000)
        : new Date(now.getTime() + (input.index + 1) * 86_400_000),
      publishedAt: new Date(input.startAt.getTime() + 55 * 60_000),
      completedAt: isCompleted ? new Date(input.startAt.getTime() + 4 * 86_400_000) : null,
      createdAt: new Date(input.startAt.getTime() + 55 * 60_000),
    }));
    const selectedTasks = Array.from({ length: 4 }, (_, itemIndex) =>
      input.tasks[(input.index * 5 + itemIndex) % input.tasks.length],
    );
    for (const [position, task] of selectedTasks.entries()) {
      const itemStatus = this.homeworkItemStatus(homeworkStatus, position, input.index);
      const item = await input.items.save(input.items.create({
        assignmentId: assignment.id,
        taskId: task.id,
        position,
        rationale: position < 3 ? 'Закрепляет тему последнего занятия' : 'Задание на самостоятельную проверку',
        answer: itemStatus === HomeworkItemStatus.PENDING ? null : task.acceptedAnswers?.[0] ?? '2',
        status: itemStatus,
        autoCorrect: itemStatus === HomeworkItemStatus.CORRECT || itemStatus === HomeworkItemStatus.INCORRECT,
        teacherCorrect: itemStatus === HomeworkItemStatus.NEEDS_REVIEW ? null : itemStatus === HomeworkItemStatus.CORRECT,
        answeredAt: itemStatus === HomeworkItemStatus.PENDING ? null : new Date(input.startAt.getTime() + (position + 1) * 86_400_000),
        gradedAt: itemStatus === HomeworkItemStatus.NEEDS_REVIEW ? null : itemStatus === HomeworkItemStatus.PENDING ? null : new Date(input.startAt.getTime() + (position + 1) * 86_400_000),
      }));
      if (itemStatus === HomeworkItemStatus.CORRECT || itemStatus === HomeworkItemStatus.INCORRECT) {
        await input.evidence.save(input.evidence.create({
          studentId: input.studentId,
          topicId: task.topicId,
          sourceType: LearningEvidenceSource.HOMEWORK,
          sourceId: item.id,
          score: itemStatus === HomeworkItemStatus.CORRECT ? 1 : 0,
          weight: 0.8,
          createdAt: item.answeredAt,
        }));
      }
    }
  }

  private async ensureUpcomingSlots(
    slots: Repository<CalendarSlot>,
    bookings: Repository<Booking>,
    teacherId: string,
    studentId: string,
  ) {
    for (let index = 0; index < FUTURE_BOOKING_COUNT; index += 1) {
      const note = `План: ${['разбор пробника', 'повторение сложных тем', 'итоговая проверка'][index]}`;
      let slot = await slots.findOne({ where: { teacherId, note } });
      if (!slot) {
        const startAt = this.dateAtUtcDaysFromNow([3, 7, 14][index], 15);
        slot = await slots.save(slots.create({
          teacherId,
          startTime: startAt,
          endTime: new Date(startAt.getTime() + 60 * 60_000),
          status: SlotStatus.BOOKED,
          lessonType: LessonType.INDIVIDUAL,
          capacity: 1,
          bookedCount: 1,
          note,
        }));
      }
      if (!(await bookings.findOne({ where: { slotId: slot.id, studentId } }))) {
        await bookings.save(bookings.create({
          studentId,
          slotId: slot.id,
          status: BookingStatus.CONFIRMED,
          isRecurring: false,
        }));
      }
    }
    for (let index = 0; index < FREE_SLOT_COUNT; index += 1) {
      const note = `Демо: свободное время ${index + 1}`;
      if (await slots.findOne({ where: { teacherId, note } })) continue;
      const startAt = this.dateAtUtcDaysFromNow([4, 9, 16][index], [7, 12, 16][index]);
      await slots.save(slots.create({
        teacherId,
        startTime: startAt,
        endTime: new Date(startAt.getTime() + 60 * 60_000),
        status: SlotStatus.AVAILABLE,
        lessonType: LessonType.INDIVIDUAL,
        capacity: 1,
        bookedCount: 0,
        note,
      }));
    }
  }

  private async ensurePayments(
    repository: Repository<Payment>,
    teacherId: string,
    studentId: string,
  ) {
    for (let index = 0; index < 8; index += 1) {
      const externalId = `SHOWCASE-PAYMENT-${index + 1}`;
      if (await repository.findOne({ where: { teacherId, studentId, externalId } })) continue;
      const dueAt = this.dateAtUtcDaysFromNow(
        index < 5 ? -70 + index * 12 : index === 5 ? -8 : index === 6 ? 5 : 16,
        9,
      );
      const status = index < 5
        ? PaymentStatus.PAID
        : index === 5
          ? PaymentStatus.OVERDUE
          : PaymentStatus.PENDING;
      await repository.save(repository.create({
        teacherId,
        studentId,
        amount: index === 5 ? '3500.00' : '3200.00',
        currency: 'RUB',
        dueAt,
        paidAt: status === PaymentStatus.PAID ? new Date(dueAt.getTime() - 86_400_000) : null,
        status,
        description: `Демонстрация · занятие ${index + 1}`,
        externalId,
        createdAt: dueAt,
      }));
    }
  }

  private async ensureMockExams(
    repository: Repository<MockExamEntity>,
    evidenceRepository: Repository<LearningEvidence>,
    teacherId: string,
    studentId: string,
    topics: CurriculumTopic[],
    tasks: CurriculumTask[],
  ) {
    for (let index = 0; index < 2; index += 1) {
      const title = `Пробный вариант · демонстрация ${index + 1}`;
      if (await repository.findOne({ where: { teacherId, studentId, title } })) continue;
      const examTasks = Array.from({ length: 10 }, (_, taskIndex) =>
        tasks[(index * 19 + taskIndex) % tasks.length],
      );
      const correctCount = index === 0 ? 6 : 8;
      const startedAt = this.dateAtUtcDaysFromNow(index === 0 ? -35 : -5, 15);
      const exam = await repository.save(repository.create({
        studentId,
        teacherId,
        examTrack: ExamTrack.EGE_PROFILE,
        title,
        status: MockExamStatus.COMPLETED,
        durationMinutes: 90,
        correctCount,
        score: index === 0 ? 60 : 80,
        startedAt,
        submittedAt: new Date(startedAt.getTime() + 88 * 60_000),
        createdAt: startedAt,
        items: examTasks.map((task, taskIndex) => {
          const topic = topics.find((item) => item.id === task.topicId);
          const correct = taskIndex < correctCount;
          return {
            taskId: task.id,
            externalId: task.externalId,
            topicId: task.topicId,
            topicCode: topic?.code ?? '',
            topicTitle: topic?.title ?? 'Задание из банка',
            taskType: task.taskType,
            statement: task.statement,
            acceptedAnswers: task.acceptedAnswers ?? [],
            answer: correct ? task.acceptedAnswers?.[0] ?? '2' : '0',
            status: correct ? 'correct' as const : 'incorrect' as const,
          };
        }),
      }));
      for (const item of exam.items) {
        if (await evidenceRepository.findOne({
          where: {
            sourceType: LearningEvidenceSource.MOCK_EXAM,
            sourceId: `${exam.id}:${item.taskId}`,
            topicId: item.topicId,
          },
        })) continue;
        await evidenceRepository.save(evidenceRepository.create({
          studentId,
          topicId: item.topicId,
          sourceType: LearningEvidenceSource.MOCK_EXAM,
          sourceId: `${exam.id}:${item.taskId}`,
          score: item.status === 'correct' ? 1 : 0,
          weight: 1,
          createdAt: startedAt,
        }));
      }
    }
  }

  private async rebuildProgress(
    progressRepository: Repository<StudentTopicProgress>,
    evidenceRepository: Repository<LearningEvidence>,
    studentId: string,
    topics: CurriculumTopic[],
  ) {
    const evidence = await evidenceRepository.find({ where: { studentId }, order: { createdAt: 'ASC' } });
    const existing = await progressRepository.find({ where: { studentId } });
    const existingByTopic = new Map(existing.map((item) => [item.topicId, item]));
    for (const topic of topics) {
      const rows = evidence.filter((item) => item.topicId === topic.id);
      if (!rows.length) continue;
      const stats = calculateMastery(rows);
      const progress = existingByTopic.get(topic.id) ?? progressRepository.create({ studentId, topicId: topic.id });
      progress.mastery = stats.mastery;
      progress.evidenceCount = stats.evidenceCount;
      progress.correctCount = stats.correctCount;
      progress.attemptCount = stats.attemptCount;
      await progressRepository.save(progress);
    }
  }

  private assessmentFor(index: number): TopicAssessment {
    const sequence = [TopicAssessment.PRACTICED, TopicAssessment.MASTERED, TopicAssessment.PRACTICED, TopicAssessment.DIFFICULTY];
    return sequence[index % sequence.length];
  }

  private assessmentScore(assessment: TopicAssessment) {
    if (assessment === TopicAssessment.MASTERED) return 0.94;
    if (assessment === TopicAssessment.DIFFICULTY) return 0.35;
    return 0.68;
  }

  private homeworkItemStatus(status: HomeworkStatus, position: number, index: number) {
    if (status === HomeworkStatus.PUBLISHED) return HomeworkItemStatus.PENDING;
    if (status === HomeworkStatus.IN_PROGRESS) {
      if (position > 1) return HomeworkItemStatus.PENDING;
      return (position + index) % 2 === 0 ? HomeworkItemStatus.CORRECT : HomeworkItemStatus.INCORRECT;
    }
    if (position === 3 && index % 2 === 0) return HomeworkItemStatus.NEEDS_REVIEW;
    return (position + index) % 4 === 0 ? HomeworkItemStatus.INCORRECT : HomeworkItemStatus.CORRECT;
  }

  private lessonSuffix(index: number) {
    return [
      'разбор базовых приёмов',
      'закрепление и практика',
      'задачи повышенной сложности',
      'разбор типичных ошибок',
    ][index % 4];
  }

  private dateAtUtcDaysFromNow(days: number, hour: number) {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() + days);
    date.setUTCHours(hour, 0, 0, 0);
    return date;
  }
}
