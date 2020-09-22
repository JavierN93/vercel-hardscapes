import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameContractorProfileToConsultantProfile1596980253607 implements MigrationInterface {
    name = 'RenameContractorProfileToConsultantProfile1596980253607';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contractor_profile" RENAME TO "consultant_profile"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "contractorProfileId" TO "consultantProfileId"`, undefined);
        await queryRunner.query(`ALTER TABLE "project" RENAME COLUMN "contractorId" TO "consultantId"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" RENAME COLUMN "consultantId" TO "contractorId"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "consultantProfileId" TO "contractorProfileId"`, undefined);
        await queryRunner.query(`ALTER TABLE "consultant_profile" RENAME TO "contractor_profile"`, undefined);
    }

}
