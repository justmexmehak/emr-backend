import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveNullConstraintPatient1756681689867 implements MigrationInterface {
    name = 'RemoveNullConstraintPatient1756681689867'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patient" ALTER COLUMN "age" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patient" ALTER COLUMN "contact" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patient" ALTER COLUMN "gender" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patient" ALTER COLUMN "gender" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patient" ALTER COLUMN "contact" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patient" ALTER COLUMN "age" SET NOT NULL`);
    }

}
