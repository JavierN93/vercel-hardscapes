import {MigrationInterface, QueryRunner} from "typeorm";

export class MultipleContractorInvitation1598828814894 implements MigrationInterface {
    name = 'MultipleContractorInvitation1598828814894'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_c0ce342fddcb5299f0e0acb7c0f"`, undefined);
        await queryRunner.query(`ALTER TABLE "contractor_profile" DROP COLUMN "nonCompleteAgreementSignedDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "UQ_c0ce342fddcb5299f0e0acb7c0f"`, undefined);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "subContractId"`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ADD "siteVisitDate" TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ADD "excavateDate" TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ADD "gradeSetDate" TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ADD "baseInstallationDate" TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ADD "screedDate" TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ADD "hardscapeInstallDate" TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ADD "adjustDate" TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ADD "cleanUpDate" TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ADD "finalPhotosTakeDate" TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ADD "materialReturnDate" TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ADD "projectId" uuid`, undefined);
        await queryRunner.query(`ALTER TABLE "contractor_profile" ADD "subContractorAgreement" TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "contractor_profile" ADD "bankName" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "contractor_profile" ADD "bankAccountName" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "contractor_profile" ADD "bankAccountNumber" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "contractor_profile" ADD "bankRoutingNumber" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "contractor_profile" ADD "bankAccountAddress" character varying`, undefined);
        await queryRunner.query(`ALTER TYPE "public"."event_type_enum" RENAME TO "event_type_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "event_type_enum" AS ENUM('YOUR_PROJECT_IS_APPROVED', 'YOUR_PROJECT_HAS_UPDATED', 'YOU_HAVE_NEW_ESTIMATE', 'YOU_HAVE_NEW_PROPOSAL', 'YOUR_PROPOSAL_HAS_BEEN_CHANGED', 'YOU_HAVE_NEW_MILESTONE_PAYMENT_REQUEST', 'YOUR_APPLICATION_IS_APPROVED', 'YOU_HAVE_NEW_SITE_VISIT_SCHEDULED', 'YOUR_MILESTONE_HAS_BEEN_PAID', 'YOUR_MILESTONE_HAS_BEEN_CHANGED', 'YOUR_PROPOSAL_HAS_BEEN_ACCEPTED', 'NEW_PROJECT_HAS_BEEN_REGISTERED', 'ESTIMATE_HAS_BEEN_ACCEPTED', 'ESTIMATE_HAS_BEEN_DECLINED', 'FINAL_PROPOSAL_HAS_BEEN_ACCEPTED', 'FINAL_PROPOSAL_HAS_BEEN_DECLINED', 'NEW_USER_REGISTERED', 'CUSTOMER_RELEASE_MILESTONE', 'CONSULTANT_REQUESTED_TO_RELEASE_MILESTONE', 'CONSULTANT_CONFIRMED_CASH_PAYMENT', 'CONSULTANT_REQUESTED_REVIEW', 'CUSTOMER_REQUESTED_CASH_PAYMENT', 'CUSTOMER_REQUESTED_CONTRACT_EVENT', 'CONTRACT_READY_EVENT', 'CUSTOMER_ACCEPTED_CONTRACT_EVENT', 'CUSTOMER_RESCHEDULED_SITE_VISIT_EVENT', 'CUSTOMER_REQUESTED_MORE_SITE_VISIT_EVENT', 'CUSTOMER_CANCELED_SITE_VISIT_EVENT', 'SITE_VISIT_SCHEDULE_UPDATED_EVENT', 'PICK_OUT_PAVERS_SCHEDULE_UPDATED_EVENT', 'CUSTOMER_REQUESTED_PICK_OUT_PAVERS_SCHEDULE_EVENT', 'CONTRACTOR_PROFILE_UPDATED_EVENT', 'ADMIN_APPROVED_BASIC_PROFILE_EVENT', 'ADMIN_DECLINED_ONBOARDING_CONTRACTOR_EVENT', 'CONTRACTOR_SIGNED_LEGAL_TERMS_EVENT', 'CONTRACTOR_SETUP_PAYMENT_EVENT', 'CONTRACTOR_FINISHED_SETTING_UP_STRIPE_ACCOUNT_EVENT', 'CONSULTANT_INVITED_CONTRACTOR_TO_PROJECT_EVENT', 'CONTRACTOR_ACCEPTED_PROJECT_EVENT', 'CONTRACTOR_DECLINED_PROJECT_EVENT', 'CONTRACTOR_FINISHED_PROJECT_EVENT', 'CONTRACTOR_REQUESTED_MILESTONE_RELEASE_EVENT', 'CONSULTANT_PAID_MILESTONE_EVENT')`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "type" TYPE "event_type_enum" USING "type"::"text"::"event_type_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "event_type_enum_old"`, undefined);
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
        await queryRunner.query(`ALTER TABLE "sub_contract" ADD CONSTRAINT "FK_624de8e37236ae4955d47863589" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sub_contract" DROP CONSTRAINT "FK_624de8e37236ae4955d47863589"`, undefined);
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
        await queryRunner.query(`CREATE TYPE "event_type_enum_old" AS ENUM('ADMIN_APPROVED_BASIC_PROFILE_EVENT', 'ADMIN_DECLINED_ONBOARDING_CONTRACTOR_EVENT', 'CONSULTANT_CONFIRMED_CASH_PAYMENT', 'CONSULTANT_INVITED_CONTRACTOR_TO_PROJECT_EVENT', 'CONSULTANT_PAID_MILESTONE_EVENT', 'CONSULTANT_REQUESTED_REVIEW', 'CONSULTANT_REQUESTED_TO_RELEASE_MILESTONE', 'CONTRACTOR_ACCEPTED_PROJECT_EVENT', 'CONTRACTOR_DECLINED_PROJECT_EVENT', 'CONTRACTOR_FINISHED_PROJECT_EVENT', 'CONTRACTOR_FINISHED_SETTING_UP_STRIPE_ACCOUNT_EVENT', 'CONTRACTOR_PROFILE_UPDATED_EVENT', 'CONTRACTOR_REQUESTED_MILESTONE_RELEASE_EVENT', 'CONTRACTOR_SIGNED_LEGAL_TERMS_EVENT', 'CONTRACT_READY_EVENT', 'CUSTOMER_ACCEPTED_CONTRACT_EVENT', 'CUSTOMER_CANCELED_SITE_VISIT_EVENT', 'CUSTOMER_RELEASE_MILESTONE', 'CUSTOMER_REQUESTED_CASH_PAYMENT', 'CUSTOMER_REQUESTED_CONTRACT_EVENT', 'CUSTOMER_REQUESTED_MORE_SITE_VISIT_EVENT', 'CUSTOMER_REQUESTED_PICK_OUT_PAVERS_SCHEDULE_EVENT', 'CUSTOMER_RESCHEDULED_SITE_VISIT_EVENT', 'ESTIMATE_HAS_BEEN_ACCEPTED', 'ESTIMATE_HAS_BEEN_DECLINED', 'FINAL_PROPOSAL_HAS_BEEN_ACCEPTED', 'FINAL_PROPOSAL_HAS_BEEN_DECLINED', 'NEW_PROJECT_HAS_BEEN_REGISTERED', 'NEW_USER_REGISTERED', 'PICK_OUT_PAVERS_SCHEDULE_UPDATED_EVENT', 'SITE_VISIT_SCHEDULE_UPDATED_EVENT', 'YOUR_APPLICATION_IS_APPROVED', 'YOUR_MILESTONE_HAS_BEEN_CHANGED', 'YOUR_MILESTONE_HAS_BEEN_PAID', 'YOUR_PROJECT_HAS_UPDATED', 'YOUR_PROJECT_IS_APPROVED', 'YOUR_PROPOSAL_HAS_BEEN_ACCEPTED', 'YOUR_PROPOSAL_HAS_BEEN_CHANGED', 'YOU_HAVE_NEW_ESTIMATE', 'YOU_HAVE_NEW_MILESTONE_PAYMENT_REQUEST', 'YOU_HAVE_NEW_PROPOSAL', 'YOU_HAVE_NEW_SITE_VISIT_SCHEDULED')`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "type" TYPE "event_type_enum_old" USING "type"::"text"::"event_type_enum_old"`, undefined);
        await queryRunner.query(`DROP TYPE "event_type_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "event_type_enum_old" RENAME TO  "event_type_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "contractor_profile" DROP COLUMN "bankAccountAddress"`, undefined);
        await queryRunner.query(`ALTER TABLE "contractor_profile" DROP COLUMN "bankRoutingNumber"`, undefined);
        await queryRunner.query(`ALTER TABLE "contractor_profile" DROP COLUMN "bankAccountNumber"`, undefined);
        await queryRunner.query(`ALTER TABLE "contractor_profile" DROP COLUMN "bankAccountName"`, undefined);
        await queryRunner.query(`ALTER TABLE "contractor_profile" DROP COLUMN "bankName"`, undefined);
        await queryRunner.query(`ALTER TABLE "contractor_profile" DROP COLUMN "subContractorAgreement"`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" DROP COLUMN "projectId"`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" DROP COLUMN "materialReturnDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" DROP COLUMN "finalPhotosTakeDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" DROP COLUMN "cleanUpDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" DROP COLUMN "adjustDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" DROP COLUMN "hardscapeInstallDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" DROP COLUMN "screedDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" DROP COLUMN "baseInstallationDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" DROP COLUMN "gradeSetDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" DROP COLUMN "excavateDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" DROP COLUMN "siteVisitDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "project" ADD "subContractId" uuid`, undefined);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "UQ_c0ce342fddcb5299f0e0acb7c0f" UNIQUE ("subContractId")`, undefined);
        await queryRunner.query(`ALTER TABLE "contractor_profile" ADD "nonCompleteAgreementSignedDate" TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_c0ce342fddcb5299f0e0acb7c0f" FOREIGN KEY ("subContractId") REFERENCES "sub_contract"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
