import { MigrationInterface, QueryRunner } from 'typeorm';

export class AllowFloatRate1757766022731 implements MigrationInterface {
  name = 'AllowFloatRate1757766022731';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "conversionRate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "conversionRate" numeric(7,5)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "conversionRate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "conversionRate" integer`,
    );
  }
}
