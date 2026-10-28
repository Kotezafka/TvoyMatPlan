import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Student } from '../students/entities/student.entity';
import { RegistrationCode } from '../admin/entities/registration-code.entity';
import { SeedService } from './seed.service';
import { StudentLearningProfile } from '../learning/entities/learning.entity';
import { CurriculumModule } from '../curriculum/curriculum.module';
import { ShowcaseSeedService } from './showcase-seed.service';
import { MockExam } from '../mock-exams/entities/mock-exam.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Teacher,
      Student,
      RegistrationCode,
      StudentLearningProfile,
      MockExam,
    ]),
    CurriculumModule,
  ],
  providers: [SeedService, ShowcaseSeedService],
})
export class SeedModule {}
