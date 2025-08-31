import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNotesFieldToVisit1756166634533 implements MigrationInterface {
    name = 'AddNotesFieldToVisit1756166634533'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "visit_record" ADD "notes" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "visit_record" DROP COLUMN "notes"`);
    }

}
