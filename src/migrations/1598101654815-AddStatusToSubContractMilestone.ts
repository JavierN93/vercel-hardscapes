import {MigrationInterface, QueryRunner} from "typeorm";

export class AddStatusToSubContractMilestone1598101654815 implements MigrationInterface {
    name = 'AddStatusToSubContractMilestone1598101654815'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "sub_contract_milestone_status_enum" AS ENUM('PENDING', 'RELEASE_REQUESTED', 'RELEASED')`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract_milestone" ADD "status" "sub_contract_milestone_status_enum" NOT NULL DEFAULT 'PENDING'`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "readAt" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "image" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "meta" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "avatar" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeCustomerId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "accessory_material_detail" ALTER COLUMN "attachments" SET DEFAULT '{}'::text[]`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ALTER COLUMN "gradePhotos" SET DEFAULT '{}'::text[]`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ALTER COLUMN "baseInstallationPhotos" SET DEFAULT '{}'::text[]`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ALTER COLUMN "finalPhotos" SET DEFAULT '{}'::text[]`, undefined);
        await queryRunner.query(`ALTER TABLE "contractor_profile" ALTER COLUMN "preferredBudget" SET DEFAULT '[0,100000]'`, undefined);
        await queryRunner.query(`ALTER TABLE "portfolio" ALTER COLUMN "attachments" SET DEFAULT '{}'::text[]`, undefined);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "attachments" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "readAt" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "accessory_site_plan" ALTER COLUMN "attachments" SET DEFAULT '{}'::text[]`, undefined);
        await queryRunner.query(`ALTER TABLE "job" ALTER COLUMN "hardSkills" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "job" ALTER COLUMN "softSkills" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "cv" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "log_rocket_recording" ALTER COLUMN "email" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "log_rocket_recording" ALTER COLUMN "firstName" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "log_rocket_recording" ALTER COLUMN "lastName" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "page_visit_history" ALTER COLUMN "sub" SET DEFAULT null`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "page_visit_history" ALTER COLUMN "sub" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "log_rocket_recording" ALTER COLUMN "lastName" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "log_rocket_recording" ALTER COLUMN "firstName" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "log_rocket_recording" ALTER COLUMN "email" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "cv" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "job" ALTER COLUMN "softSkills" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "job" ALTER COLUMN "hardSkills" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "accessory_site_plan" ALTER COLUMN "attachments" SET DEFAULT '{}'`, undefined);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "readAt" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "attachments" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "portfolio" ALTER COLUMN "attachments" SET DEFAULT '{}'`, undefined);
        await queryRunner.query(`ALTER TABLE "contractor_profile" ALTER COLUMN "preferredBudget" SET DEFAULT '[0,100001)'`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ALTER COLUMN "finalPhotos" SET DEFAULT '{}'`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ALTER COLUMN "baseInstallationPhotos" SET DEFAULT '{}'`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ALTER COLUMN "gradePhotos" SET DEFAULT '{}'`, undefined);
        await queryRunner.query(`ALTER TABLE "accessory_material_detail" ALTER COLUMN "attachments" SET DEFAULT '{}'`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeCustomerId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "avatar" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "meta" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "image" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "readAt" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract_milestone" DROP COLUMN "status"`, undefined);
        await queryRunner.query(`DROP TYPE "sub_contract_milestone_status_enum"`, undefined);
    }

}
