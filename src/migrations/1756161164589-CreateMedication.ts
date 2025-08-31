import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMedication1756161164589 implements MigrationInterface {
    name = 'CreateMedication1756161164589'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "medication" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0682f5b7379fea3c2fdb77d6545" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "prescription_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "dosage" character varying NOT NULL, "frequency" character varying NOT NULL, "duration" character varying NOT NULL, "visitRecordId" uuid, "medicationId" uuid, CONSTRAINT "PK_c6da8fb39ffdf05567203293520" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "visit_record" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "visitDate" TIMESTAMP NOT NULL, "diagnosis" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "patientId" uuid, CONSTRAINT "PK_50ab21a9b10c96fba7617811f8a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "patient" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "patient" DROP COLUMN "updated_at"`);
        await queryRunner.query(`CREATE TYPE "public"."patient_gender_enum" AS ENUM('male', 'female', 'other')`);
        await queryRunner.query(`ALTER TABLE "patient" ADD "gender" "public"."patient_gender_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patient" ADD "mrNumber" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patient" ADD CONSTRAINT "UQ_3027ec857f2c8f00397d75a327b" UNIQUE ("mrNumber")`);
        await queryRunner.query(`ALTER TABLE "patient" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "patient" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "prescription_item" ADD CONSTRAINT "FK_533a31ed8e203bab5ec6f79a9de" FOREIGN KEY ("visitRecordId") REFERENCES "visit_record"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "prescription_item" ADD CONSTRAINT "FK_5d07e939f61a43c29fc84263e15" FOREIGN KEY ("medicationId") REFERENCES "medication"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "visit_record" ADD CONSTRAINT "FK_487a259b2835953c53f71af0cc8" FOREIGN KEY ("patientId") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "visit_record" DROP CONSTRAINT "FK_487a259b2835953c53f71af0cc8"`);
        await queryRunner.query(`ALTER TABLE "prescription_item" DROP CONSTRAINT "FK_5d07e939f61a43c29fc84263e15"`);
        await queryRunner.query(`ALTER TABLE "prescription_item" DROP CONSTRAINT "FK_533a31ed8e203bab5ec6f79a9de"`);
        await queryRunner.query(`ALTER TABLE "patient" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "patient" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "patient" DROP CONSTRAINT "UQ_3027ec857f2c8f00397d75a327b"`);
        await queryRunner.query(`ALTER TABLE "patient" DROP COLUMN "mrNumber"`);
        await queryRunner.query(`ALTER TABLE "patient" DROP COLUMN "gender"`);
        await queryRunner.query(`DROP TYPE "public"."patient_gender_enum"`);
        await queryRunner.query(`ALTER TABLE "patient" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "patient" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`DROP TABLE "visit_record"`);
        await queryRunner.query(`DROP TABLE "prescription_item"`);
        await queryRunner.query(`DROP TABLE "medication"`);
    }

}
