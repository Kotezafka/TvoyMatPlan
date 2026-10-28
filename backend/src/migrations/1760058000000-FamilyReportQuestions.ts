import { MigrationInterface, QueryRunner } from 'typeorm';

export class FamilyReportQuestions1760058000000 implements MigrationInterface {
  name = 'FamilyReportQuestions1760058000000';

  async up(queryRunner: QueryRunner) {
    await queryRunner.query(`
      ALTER TABLE "students"
        ADD COLUMN IF NOT EXISTS "parentReportQuestions" jsonb NOT NULL DEFAULT '[]'::jsonb
    `);
    await queryRunner.query(`
      ALTER TABLE "compute_jobs"
        ADD COLUMN IF NOT EXISTS "reportQuestions" jsonb NOT NULL DEFAULT '[]'::jsonb
    `);
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.query(`ALTER TABLE "compute_jobs" DROP COLUMN IF EXISTS "reportQuestions"`);
    await queryRunner.query(`ALTER TABLE "students" DROP COLUMN IF EXISTS "parentReportQuestions"`);
  }
}
