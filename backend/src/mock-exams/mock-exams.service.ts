import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CurriculumService } from '../curriculum/curriculum.service';
import {
  CurriculumSourceKind,
  ExamTrack,
} from '../curriculum/entities/curriculum.entity';
import { StudentLearningProfile } from '../learning/entities/learning.entity';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/enums/user-role.enum';
import { answerMatches } from '../learning/learning.algorithms';
import { ProgressService } from '../learning/progress.service';
import { CreateMockExamDto, GradeMockExamItemDto, SubmitMockExamDto } from './dto/mock-exam.dto';
import { MockExam, MockExamItem, MockExamStatus } from './entities/mock-exam.entity';
import { mockExamQuestionCount, selectMockExamTasks } from './mock-exam-blueprint';

const MOCK_EXAM_IMAGE_KEY_PREFIX = 'curriculum/assets/mathstart/';

@Injectable()
export class MockExamsService {
  constructor(
    @InjectRepository(MockExam) private readonly examRepo: Repository<MockExam>,
    @InjectRepository(Student) private readonly studentRepo: Repository<Student>,
    @InjectRepository(Teacher) private readonly teacherRepo: Repository<Teacher>,
    @InjectRepository(StudentLearningProfile) private readonly profileRepo: Repository<StudentLearningProfile>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly curriculum: CurriculumService,
    private readonly progress: ProgressService,
  ) {}

  async list(user: User, requestedStudentId?: string) {
    const studentId = user.role === UserRole.STUDENT ? (await this.student(user)).id : undefined;
    const teacherId = user.role === UserRole.TEACHER ? (await this.teacher(user)).id : undefined;
    if (requestedStudentId && user.role === UserRole.TEACHER) {
      const requested = await this.studentRepo.findOneBy({ id: requestedStudentId });
      if (!requested || requested.teacherId !== teacherId) throw new ForbiddenException('Это не ваш ученик');
    }
    const where = studentId
      ? { studentId }
      : user.role === UserRole.TEACHER
        ? { teacherId: teacherId!, ...(requestedStudentId ? { studentId: requestedStudentId } : {}) }
        : requestedStudentId ? { studentId: requestedStudentId } : {};
    const rows = await this.examRepo.find({ where, order: { createdAt: 'DESC' }, relations: ['student', 'student.user'] });
    return rows.map((row) => this.serialize(row, user.role !== UserRole.STUDENT));
  }

  async create(user: User, dto: CreateMockExamDto) {
    const teacher = await this.teacher(user);
    const student = await this.studentRepo.findOne({ where: { id: dto.studentId }, relations: ['user'] });
    if (!student || student.teacherId !== teacher.id) throw new ForbiddenException('Это не ваш ученик');
    const profile = await this.profileRepo.findOne({ where: { studentId: student.id } });
    const track = dto.examTrack ?? profile?.examTrack ?? ExamTrack.EGE_PROFILE;
    return this.createExam(student, teacher.id, track, dto.title, dto.count, true);
  }

  async startForStudent(user: User) {
    const student = await this.student(user);
    if (!student.teacherId) throw new BadRequestException('Сначала привяжитесь к преподавателю');
    const profile = await this.profileRepo.findOne({
      where: { studentId: student.id },
      relations: ['curriculumRelease'],
    });
    if (!profile) throw new BadRequestException('Сначала выберите экзамен в разделе «Мой прогресс»');
    const release = await this.curriculum.getActiveRelease(profile.examTrack, true);
    if (release.sourceKind === 'demo') {
      throw new BadRequestException('Внутренний пробник доступен после загрузки проверенного банка заданий. Демо-каталог нельзя использовать как вариант ФИПИ.');
    }
    if (!release.tasks?.length) {
      throw new BadRequestException('В активном каталоге пока нет заданий. Попросите администратора загрузить проверенный банк.');
    }
    if (
      release.sourceKind === CurriculumSourceKind.IMPORTED &&
      profile.curriculumReleaseId !== release.id
    ) {
      profile.curriculumReleaseId = release.id;
      profile.curriculumRelease = release;
      await this.profileRepo.save(profile);
    }
    const taskCount = mockExamQuestionCount(release.tasks);
    return this.createExam(student, student.teacherId, profile.examTrack, undefined, taskCount, false);
  }

  private async createExam(student: Student, teacherId: string, track: ExamTrack, title?: string, requestedCount?: number, includeAnswers = false) {
    const release = await this.curriculum.getActiveRelease(track, true);
    const count = requestedCount ?? Math.min(20, release.tasks.length);
    if (release.tasks.length < count) throw new BadRequestException('В каталоге недостаточно заданий для пробника');
    const items: MockExamItem[] = selectMockExamTasks(
      release.tasks,
      count,
      track === ExamTrack.EGE_PROFILE || track === ExamTrack.OGE,
      track === ExamTrack.OGE ? 0.25 : 0.35,
    ).map(({ task, part }) => {
      const imageKeys = this.getImageKeys(task);
      return {
        taskId: task.id, externalId: task.externalId, topicId: task.topicId, topicCode: task.topic.code, topicTitle: task.topic.title,
        taskType: task.taskType, examPart: part, statement: task.statement, acceptedAnswers: task.acceptedAnswers, solution: task.solution,
        ...(imageKeys ? { imageKeys } : {}), status: 'pending', answer: null,
      };
    });
    const exam = this.examRepo.create({ studentId: student.id, teacherId, examTrack: track, title: title?.trim() || `Пробник ${track.toUpperCase()}`, durationMinutes: 60, items, startedAt: new Date() });
    return this.serialize(await this.examRepo.save(exam), includeAnswers);
  }

  async get(user: User, id: string) {
    const exam = await this.examRepo.findOne({ where: { id }, relations: ['student', 'student.user', 'teacher', 'teacher.user'] });
    if (!exam) throw new NotFoundException('Пробник не найден');
    await this.assertAccess(user, exam);
    return this.serialize(exam, user.role !== UserRole.STUDENT);
  }

  async getAuthorizedImageKey(user: User, examId: string, taskId: string, index: number): Promise<string> {
    const exam = await this.examRepo.findOne({ where: { id: examId } });
    if (!exam) throw new NotFoundException('Пробник не найден');
    await this.assertAccess(user, exam);
    if (!Number.isInteger(index) || index < 0) throw new BadRequestException('Некорректный индекс изображения');
    const item = exam.items?.find((candidate) => candidate.taskId === taskId);
    const key = item?.imageKeys?.[index];
    if (!isMockExamImageKey(key)) throw new NotFoundException('Изображение задания не найдено');
    return key;
  }

  async submit(user: User, id: string, dto: SubmitMockExamDto) {
    const exam = await this.examRepo.findOne({ where: { id }, relations: ['student'] });
    if (!exam) throw new NotFoundException('Пробник не найден');
    if (user.role !== UserRole.STUDENT || (await this.student(user)).id !== exam.studentId) throw new ForbiddenException();
    if (exam.status === MockExamStatus.COMPLETED) throw new BadRequestException('Пробник уже завершён');
    const knownTaskIds = new Set(exam.items.map((item) => item.taskId));
    if (dto.answers.some((answer) => !knownTaskIds.has(answer.taskId))) {
      throw new BadRequestException('Ответ относится к другому пробнику');
    }
    const answers = new Map(dto.answers.map((answer) => [answer.taskId, answer]));
    let correct = 0;
    const touched: Array<{ taskId: string; correct: boolean | null }> = [];
    exam.items = exam.items.map((item) => {
      const submission = answers.get(item.taskId);
      const answer = submission?.answer.trim() ?? '';
      const work = submission?.work?.trim() ?? '';
      const result = answer.length ? answerMatches(answer, item.acceptedAnswers) : false;
      const isCorrect = result === true;
      if (isCorrect) correct += 1;
      touched.push({ taskId: item.taskId, correct: result === null ? null : isCorrect });
      return { ...item, answer, work: work || null, status: result === null ? 'needs_review' : isCorrect ? 'correct' : 'incorrect' };
    });
    exam.correctCount = correct;
    exam.score = this.score(exam.items);
    exam.status = MockExamStatus.COMPLETED;
    exam.submittedAt = new Date();
    await this.dataSource.transaction(async (manager) => {
      await manager.save(exam);
      for (const item of touched) {
        const source = exam.items.find((candidate) => candidate.taskId === item.taskId);
        if (source && item.correct !== null) await this.progress.recordMockEvidence(manager, { studentId: exam.studentId, sourceId: `${exam.id}:${item.taskId}`, topicId: source.topicId, correct: item.correct });
      }
    });
    return this.serialize(exam, true);
  }

  async grade(user: User, id: string, dto: GradeMockExamItemDto) {
    if (user.role !== UserRole.TEACHER) throw new ForbiddenException();
    const exam = await this.examRepo.findOne({ where: { id } });
    if (!exam) throw new NotFoundException('Пробник не найден');
    await this.assertAccess(user, exam);
    if (exam.status !== MockExamStatus.COMPLETED) throw new ConflictException('Сначала ученик должен завершить пробник');
    const item = exam.items.find((candidate) => candidate.taskId === dto.taskId);
    if (!item) throw new NotFoundException('Задание пробника не найдено');
    if (item.status !== 'needs_review') throw new ConflictException('Это задание уже проверено автоматически');
    item.status = dto.correct ? 'correct' : 'incorrect';
    exam.correctCount = exam.items.filter((candidate) => candidate.status === 'correct').length;
    exam.score = this.score(exam.items);
    await this.dataSource.transaction(async (manager) => {
      await manager.save(exam);
      await this.progress.recordMockEvidence(manager, {
        studentId: exam.studentId,
        sourceId: `${exam.id}:${item.taskId}`,
        topicId: item.topicId,
        correct: dto.correct,
      });
    });
    return this.serialize(exam, true);
  }

  private async assertAccess(user: User, exam: MockExam) {
    if (user.role === UserRole.ADMIN) return;
    if (user.role === UserRole.STUDENT && (await this.student(user)).id === exam.studentId) return;
    if (user.role === UserRole.TEACHER && (await this.teacher(user)).id === exam.teacherId) return;
    throw new ForbiddenException();
  }
  private score(items: MockExamItem[]) {
    const graded = items.filter((item) => item.status === 'correct' || item.status === 'incorrect').length;
    const correct = items.filter((item) => item.status === 'correct').length;
    return graded ? Math.round((correct / graded) * 100) : 0;
  }
  private async student(user: User) { const value = await this.studentRepo.findOneBy({ userId: user.id }); if (!value) throw new NotFoundException('Ученик не найден'); return value; }
  private async teacher(user: User) { const value = await this.teacherRepo.findOneBy({ userId: user.id }); if (!value) throw new NotFoundException('Преподаватель не найден'); return value; }
  private getImageKeys(task: { metadata?: Record<string, unknown> }): string[] | undefined {
    const imageKeys = task.metadata?.imageKeys;
    return Array.isArray(imageKeys) && imageKeys.every((key): key is string => typeof key === 'string' && key.trim().length > 0)
      ? [...imageKeys]
      : undefined;
  }
  private serialize(exam: MockExam, includeAnswers: boolean) { return { id: exam.id, studentId: exam.studentId, teacherId: exam.teacherId, examTrack: exam.examTrack, title: exam.title, status: exam.status, durationMinutes: exam.durationMinutes, correctCount: exam.correctCount, gradedCount: exam.items.filter((item) => item.status === 'correct' || item.status === 'incorrect').length, score: exam.score, startedAt: exam.startedAt, submittedAt: exam.submittedAt, createdAt: exam.createdAt, student: exam.student ? { id: exam.student.id, user: exam.student.user } : undefined, items: exam.items.map((item) => ({ ...item, ...(includeAnswers ? {} : { acceptedAnswers: undefined, solution: undefined }) })) }; }
}

function isMockExamImageKey(value: unknown): value is string {
  if (typeof value !== 'string' || !value.startsWith(MOCK_EXAM_IMAGE_KEY_PREFIX) || /[\\\u0000-\u001f]/.test(value)) {
    return false;
  }
  const path = value.slice(MOCK_EXAM_IMAGE_KEY_PREFIX.length);
  return path.length > 0 && path.split('/').every((segment) => segment.length > 0 && segment !== '.' && segment !== '..');
}
