import {MigrationInterface, QueryRunner} from "typeorm";

export class RenameSubContractorAgreementDate1598847085667 implements MigrationInterface {
    name = 'RenameSubContractorAgreementDate1598847085667'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contractor_profile" RENAME COLUMN "subContractorAgreement" TO "subContractorAgreementDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "readAt" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "image" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "meta" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "avatar" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeCustomerId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "accessory_material_detail" ALTER COLUMN "attachments" SET DEFAULT '{}'::text[]`, undefined);
        await queryRunner.query(`ALTER TYPE "public"."sub_contract_milestone_status_enum" RENAME TO "sub_contract_milestone_status_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "sub_contract_milestone_status_enum" AS ENUM('PENDING', 'RELEASE_REQUESTED', 'APPROVAL_REQUESTED', 'RELEASED')`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract_milestone" ALTER COLUMN "status" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract_milestone" ALTER COLUMN "status" TYPE "sub_contract_milestone_status_enum" USING "status"::"text"::"sub_contract_milestone_status_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract_milestone" ALTER COLUMN "status" SET DEFAULT 'PENDING'`, undefined);
        await queryRunner.query(`DROP TYPE "sub_contract_milestone_status_enum_old"`, undefined);
        await queryRunner.query(`ALTER TABLE "material_return" ALTER COLUMN "attachments" SET DEFAULT '{}'::text[]`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ALTER COLUMN "gradePhotos" SET DEFAULT '{}'::text[]`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ALTER COLUMN "baseInstallationPhotos" SET DEFAULT '{}'::text[]`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ALTER COLUMN "finalPhotos" SET DEFAULT '{}'::text[]`, undefined);
        await queryRunner.query(`ALTER TABLE "contractor_profile" ALTER COLUMN "preferredBudget" SET DEFAULT '[0,100000]'`, undefined);
        await queryRunner.query(`ALTER TYPE "public"."contractor_profile_contractorclass_enum" RENAME TO "contractor_profile_contractorclass_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "contractor_profile_contractorclass_enum" AS ENUM('A', 'B')`, undefined);
        await queryRunner.query(`ALTER TABLE "contractor_profile" ALTER COLUMN "contractorClass" TYPE "contractor_profile_contractorclass_enum" USING "contractorClass"::"text"::"contractor_profile_contractorclass_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "contractor_profile_contractorclass_enum_old"`, undefined);
        await queryRunner.query(`ALTER TABLE "portfolio" ALTER COLUMN "attachments" SET DEFAULT '{}'::text[]`, undefined);
        await queryRunner.query(`ALTER TYPE "public"."milestone_status_enum" RENAME TO "milestone_status_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "milestone_status_enum" AS ENUM('PENDING', 'RELEASE_REQUESTED', 'APPROVAL_REQUESTED', 'RELEASED')`, undefined);
        await queryRunner.query(`ALTER TABLE "milestone" ALTER COLUMN "status" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "milestone" ALTER COLUMN "status" TYPE "milestone_status_enum" USING "status"::"text"::"milestone_status_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "milestone" ALTER COLUMN "status" SET DEFAULT 'PENDING'`, undefined);
        await queryRunner.query(`DROP TYPE "milestone_status_enum_old"`, undefined);
        await queryRunner.query(`ALTER TYPE "public"."email_log_type_enum" RENAME TO "email_log_type_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "email_log_type_enum" AS ENUM('CONFIRM_REGISTER', 'MESSAGE_RECEIVED', 'RESET_PASSWORD', 'INVITATION', 'PROJECT_CREATED', 'ESTIMATE_READY', 'ESTIMATE_UPDATED', 'SITE_VISIT_SCHEDULED', 'SITE_VISIT_REMINDER_FOR_CUSTOMER', 'SITE_VISIT_SCHEDULE_CHANGED', 'RECEIVED_FINAL_PROPOSAL', 'FINAL_PROPOSAL_UPDATED', 'FINAL_PROPOSAL_ACCEPTED', 'MILESTONE_PAYMENT_REQUESTED', 'RECEIVED_MILESTONE_PAYMENT', 'PICK_PAVERS_SCHEDULED', 'PICK_PAVERS_SCHEDULE_CHANGED', 'FINAL_MILESTONE_PAYMENT_REQUESTED', 'FINAL_MILESTONE_MODIFIED', 'TESTIMONIAL_REQUEST', 'DEPOSIT_MILESTONE_UPDATED', 'RECEIVED_FINAL_MILESTONE_WITH_HOLD', 'LEGAL_TERMS_SIGN_REMINDER', 'PAYMENT_SETUP_REMINDER', 'INVITED_TO_PROJECT', 'SUB_CONTRACT_MILESTONE_PAID', 'CONTRACTOR_INVITATION', 'NEW_PROJECT_REGISTERED', 'ESTIMATE_REMINDER', 'ESTIMATE_ACCEPTED', 'SITE_VISIT_REMINDER_FOR_CONSULTANT', 'SUBMIT_PROPOSAL_REMINDER', 'DEPOSIT_MADE', 'MILESTONE_PAID', 'CONTRACT_READY', 'CONTRACT_SIGNED', 'SITE_VISIT_SCHEDULE_CHANGE_REQUEST', 'PICK_PAVERS_SCHEDULE_CHANGE_REQUEST', 'ESTIMATE_DECLINED', 'FINAL_PROPOSAL_DECLINED', 'SUB_CONTRACT_ACCEPTED', 'SUB_CONTRACT_DECLINED', 'CONTRACTOR_REQUESTED_MILESTONE_PAYMENT', 'SUB_CONTRACT_COMPLETED', 'CONTRACTOR_UPDATED_PROFILE', 'CHANGE_EMAIL')`, undefined);
        await queryRunner.query(`ALTER TABLE "email_log" ALTER COLUMN "type" TYPE "email_log_type_enum" USING "type"::"text"::"email_log_type_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "email_log_type_enum_old"`, undefined);
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
        await queryRunner.query(`CREATE TYPE "email_log_type_enum_old" AS ENUM('CHANGE_EMAIL', 'CONFIRM_REGISTER', 'CONTRACTOR_REQUESTED_MILESTONE_PAYMENT', 'CONTRACTOR_UPDATED_PROFILE', 'CONTRACT_READY', 'CONTRACT_SIGNED', 'DEPOSIT_MADE', 'DEPOSIT_MILESTONE_UPDATED', 'ESTIMATE_ACCEPTED', 'ESTIMATE_DECLINED', 'ESTIMATE_READY', 'ESTIMATE_REMINDER', 'ESTIMATE_UPDATED', 'FINAL_MILESTONE_MODIFIED', 'FINAL_MILESTONE_PAYMENT_REQUESTED', 'FINAL_PROPOSAL_ACCEPTED', 'FINAL_PROPOSAL_DECLINED', 'FINAL_PROPOSAL_UPDATED', 'INVITATION', 'INVITED_TO_PROJECT', 'LEGAL_TERMS_SIGN_REMINDER', 'MESSAGE_RECEIVED', 'MILESTONE_PAID', 'MILESTONE_PAYMENT_REQUESTED', 'NEW_PROJECT_REGISTERED', 'PAYMENT_SETUP_REMINDER', 'PICK_PAVERS_SCHEDULED', 'PICK_PAVERS_SCHEDULE_CHANGED', 'PICK_PAVERS_SCHEDULE_CHANGE_REQUEST', 'PROJECT_CREATED', 'RECEIVED_FINAL_MILESTONE_WITH_HOLD', 'RECEIVED_FINAL_PROPOSAL', 'RECEIVED_MILESTONE_PAYMENT', 'RESET_PASSWORD', 'SITE_VISIT_REMINDER_FOR_CONSULTANT', 'SITE_VISIT_REMINDER_FOR_CUSTOMER', 'SITE_VISIT_SCHEDULED', 'SITE_VISIT_SCHEDULE_CHANGED', 'SITE_VISIT_SCHEDULE_CHANGE_REQUEST', 'SUBMIT_PROPOSAL_REMINDER', 'SUB_CONTRACT_ACCEPTED', 'SUB_CONTRACT_COMPLETED', 'SUB_CONTRACT_DECLINED', 'SUB_CONTRACT_MILESTONE_PAID', 'TESTIMONIAL_REQUEST')`, undefined);
        await queryRunner.query(`ALTER TABLE "email_log" ALTER COLUMN "type" TYPE "email_log_type_enum_old" USING "type"::"text"::"email_log_type_enum_old"`, undefined);
        await queryRunner.query(`DROP TYPE "email_log_type_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "email_log_type_enum_old" RENAME TO  "email_log_type_enum"`, undefined);
        await queryRunner.query(`CREATE TYPE "milestone_status_enum_old" AS ENUM('PENDING', 'RELEASED', 'RELEASE_REQUESTED')`, undefined);
        await queryRunner.query(`ALTER TABLE "milestone" ALTER COLUMN "status" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "milestone" ALTER COLUMN "status" TYPE "milestone_status_enum_old" USING "status"::"text"::"milestone_status_enum_old"`, undefined);
        await queryRunner.query(`ALTER TABLE "milestone" ALTER COLUMN "status" SET DEFAULT 'PENDING'`, undefined);
        await queryRunner.query(`DROP TYPE "milestone_status_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "milestone_status_enum_old" RENAME TO  "milestone_status_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "portfolio" ALTER COLUMN "attachments" SET DEFAULT '{}'`, undefined);
        await queryRunner.query(`CREATE TYPE "contractor_profile_contractorclass_enum_old" AS ENUM('A', 'B', 'C', 'S')`, undefined);
        await queryRunner.query(`ALTER TABLE "contractor_profile" ALTER COLUMN "contractorClass" TYPE "contractor_profile_contractorclass_enum_old" USING "contractorClass"::"text"::"contractor_profile_contractorclass_enum_old"`, undefined);
        await queryRunner.query(`DROP TYPE "contractor_profile_contractorclass_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "contractor_profile_contractorclass_enum_old" RENAME TO  "contractor_profile_contractorclass_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "contractor_profile" ALTER COLUMN "preferredBudget" SET DEFAULT '[0,100001)'`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ALTER COLUMN "finalPhotos" SET DEFAULT '{}'`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ALTER COLUMN "baseInstallationPhotos" SET DEFAULT '{}'`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ALTER COLUMN "gradePhotos" SET DEFAULT '{}'`, undefined);
        await queryRunner.query(`ALTER TABLE "material_return" ALTER COLUMN "attachments" SET DEFAULT '{}'`, undefined);
        await queryRunner.query(`CREATE TYPE "sub_contract_milestone_status_enum_old" AS ENUM('PENDING', 'RELEASED', 'RELEASE_REQUESTED')`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract_milestone" ALTER COLUMN "status" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract_milestone" ALTER COLUMN "status" TYPE "sub_contract_milestone_status_enum_old" USING "status"::"text"::"sub_contract_milestone_status_enum_old"`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract_milestone" ALTER COLUMN "status" SET DEFAULT 'PENDING'`, undefined);
        await queryRunner.query(`DROP TYPE "sub_contract_milestone_status_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "sub_contract_milestone_status_enum_old" RENAME TO  "sub_contract_milestone_status_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "accessory_material_detail" ALTER COLUMN "attachments" SET DEFAULT '{}'`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeCustomerId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "avatar" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "meta" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "image" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "readAt" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "contractor_profile" RENAME COLUMN "subContractorAgreementDate" TO "subContractorAgreement"`, undefined);
    }

}
