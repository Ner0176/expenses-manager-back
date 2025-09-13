import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDb1757759205714 implements MigrationInterface {
  name = 'InitDb1757759205714';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "category" ("id" SERIAL NOT NULL, "tag" character varying NOT NULL, "icon" character varying NOT NULL, "isDefault" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL, "amount" double precision NOT NULL, "currency" character varying NOT NULL, "conversionRate" integer, "title" character varying NOT NULL, "description" character varying, "categoryId" integer, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_d3951864751c5812e70d033978d" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_d3951864751c5812e70d033978d"`,
    );
    await queryRunner.query(`DROP TABLE "transaction"`);
    await queryRunner.query(`DROP TABLE "category"`);
  }
}
