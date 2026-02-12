import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDepartmentsTable1769382026908 implements MigrationInterface {
    name = 'CreateDepartmentsTable1769382026908'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "departments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_71ef7108927065979c09903e903" UNIQUE ("name"), CONSTRAINT "PK_8395148a0429f6264d858348ea2" PRIMARY KEY ("id"))`);
        
        // Seed departments
        await queryRunner.query(`INSERT INTO "departments" ("name") VALUES ('HR'), ('Truckers')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "departments"`);
    }
}
