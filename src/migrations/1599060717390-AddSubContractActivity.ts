import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSubContractActivity1599060717390 implements MigrationInterface {
    name = 'AddSubContractActivity1599060717390'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "sub_contract_activity_type_enum" AS ENUM('PROJECT_ACCEPTED', 'PROJECT_DECLINED', 'SITE_VISITED', 'EXCAVATED', 'GRADE_SET', 'BASE_INSTALLED', 'SCREEDED', 'HARDSCAPE_INSTALLED', 'ADJUSTED', 'CLEANED_UP', 'FINAL_PHOTOS_TAKEN', 'MATERIAL_RETURNED', 'MILESTONE_1_PAYMENT_REQUESTED', 'APPROVED_MILESTONE_1_PAYMENT', 'MILESTONE_2_PAYMENT_REQUESTED', 'APPROVED_MILESTONE_2_PAYMENT')`, undefined);
        await queryRunner.query(`CREATE TABLE "sub_contract_activity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "type" "sub_contract_activity_type_enum" NOT NULL, "date" TIMESTAMP NOT NULL, "subContractId" uuid, CONSTRAINT "PK_db7f48fe46fefffc0b9e6f078a2" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "custom_payment_item" DROP COLUMN "accepted"`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" DROP COLUMN "siteVisitDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" DROP COLUMN "excavateDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" DROP COLUMN "gradeSetDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" DROP COLUMN "baseInstallationDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" DROP COLUMN "screedDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" DROP COLUMN "hardscapeInstallDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" DROP COLUMN "adjustDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" DROP COLUMN "cleanUpDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" DROP COLUMN "finalPhotosTakeDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" DROP COLUMN "materialReturnDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "readAt" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "image" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "meta" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "avatar" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeCustomerId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "accessory_material_detail" ALTER COLUMN "attachments" SET DEFAULT '{}'::text[]`, undefined);
        await queryRunner.query(`ALTER TABLE "material_return" ALTER COLUMN "attachments" SET DEFAULT '{}'::text[]`, undefined);
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
        await queryRunner.query(`ALTER TABLE "sub_contract_activity" ADD CONSTRAINT "FK_274f7a31353abaea26d1fdb9397" FOREIGN KEY ("subContractId") REFERENCES "sub_contract"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sub_contract_activity" DROP CONSTRAINT "FK_274f7a31353abaea26d1fdb9397"`, undefined);
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
        await queryRunner.query(`ALTER TABLE "material_return" ALTER COLUMN "attachments" SET DEFAULT '{}'`, undefined);
        await queryRunner.query(`ALTER TABLE "accessory_material_detail" ALTER COLUMN "attachments" SET DEFAULT '{}'`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeCustomerId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "avatar" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "meta" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "image" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "readAt" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ADD "materialReturnDate" TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ADD "finalPhotosTakeDate" TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ADD "cleanUpDate" TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ADD "adjustDate" TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ADD "hardscapeInstallDate" TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ADD "screedDate" TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ADD "baseInstallationDate" TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ADD "gradeSetDate" TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ADD "excavateDate" TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ADD "siteVisitDate" TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "custom_payment_item" ADD "accepted" boolean NOT NULL DEFAULT true`, undefined);
        await queryRunner.query(`DROP TABLE "sub_contract_activity"`, undefined);
        await queryRunner.query(`DROP TYPE "sub_contract_activity_type_enum"`, undefined);
    }

}
