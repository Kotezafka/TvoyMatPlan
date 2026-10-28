import { MigrationInterface, QueryRunner } from 'typeorm';

export class PermanentFamilyAccess1760059000000 implements MigrationInterface {
  name = 'PermanentFamilyAccess1760059000000';

  async up(queryRunner: QueryRunner) {
    await queryRunner.query(`
      ALTER TABLE "students"
        ADD COLUMN IF NOT EXISTS "familyAccessTokenCipherText" text,
        ADD COLUMN IF NOT EXISTS "familyAccessTokenHashes" jsonb NOT NULL DEFAULT '[]'::jsonb
    `);
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.query(`
      ALTER TABLE "students"
        DROP COLUMN IF EXISTS "familyAccessTokenHashes",
        DROP COLUMN IF EXISTS "familyAccessTokenCipherText"
    `);
  }
}
