import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSubContract1598042172520 implements MigrationInterface {
    name = 'AddSubContract1598042172520'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_e72528f4484a73df51e7578d54f"`, undefined);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_bd374c8eb325f260166479c2518"`, undefined);
        await queryRunner.query(`CREATE TYPE "cost_item_type_enum" AS ENUM('STEPS', 'SITTING_WALL', 'PILLARS', 'LIGHTING', 'PATIO', 'RAISED_PATIO', 'WALKWAY', 'RETAINING_WALL', 'POOL_PATIO', 'FIRE_PIT', 'DRIVEWAY_PARKING', 'VENEER', 'FIREPLACE', 'OUTDOOR_KITCHEN', 'CLEANING_SANDING', 'MINOR_REPAIR', 'LANDSCAPING_PLANTS', 'OTHER')`, undefined);
        await queryRunner.query(`CREATE TABLE "cost_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "type" "cost_item_type_enum" NOT NULL, "comment" character varying NOT NULL, "cost" numeric(17,2) NOT NULL DEFAULT 0, "sitePlanId" uuid, CONSTRAINT "PK_b142403afde4c8224d82ae013aa" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "custom_payment_item_type_enum" AS ENUM('RENT')`, undefined);
        await queryRunner.query(`CREATE TABLE "custom_payment_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "type" "custom_payment_item_type_enum" NOT NULL, "comment" character varying NOT NULL, "accepted" boolean NOT NULL DEFAULT true, "cost" numeric(17,2) NOT NULL DEFAULT 0, "sitePlanId" uuid, CONSTRAINT "PK_df17f2a8bd7e0d0778dc4598c91" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "accessory_material_detail_type_enum" AS ENUM('STEPS', 'SITTING_WALL', 'PILLARS', 'LIGHTING', 'PATIO', 'RAISED_PATIO', 'WALKWAY', 'RETAINING_WALL', 'POOL_PATIO', 'FIRE_PIT', 'DRIVEWAY_PARKING', 'VENEER', 'FIREPLACE', 'OUTDOOR_KITCHEN', 'CLEANING_SANDING', 'MINOR_REPAIR', 'LANDSCAPING_PLANTS', 'OTHER')`, undefined);
        await queryRunner.query(`CREATE TYPE "accessory_material_detail_materials_enum" AS ENUM('PAVERS', 'NATURAL_STONE', 'BLUE_STONE', 'GRANITE', 'BRICK', 'SRW_SYSTEMS', 'SLATE', 'FIELD_STONE', 'BOULDERS', 'CONCRETE', 'STAMPED_CONCRETE', 'SYNTHETIC_GRASS', 'MANUFACTURED_BLOCK', 'VENEER', 'OTHER')`, undefined);
        await queryRunner.query(`CREATE TABLE "accessory_material_detail" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "type" "accessory_material_detail_type_enum" NOT NULL, "materials" "accessory_material_detail_materials_enum" array NOT NULL DEFAULT '{}', "comment" character varying NOT NULL DEFAULT '', "attachments" text array NOT NULL DEFAULT '{}'::text[], "sitePlanId" uuid, CONSTRAINT "PK_165327cf07aa7a93ea101377810" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "site_plan" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "brief" character varying NOT NULL DEFAULT '', "existingSiteAssessment" character varying NOT NULL DEFAULT '', "discount" integer NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "comment" character varying NOT NULL, CONSTRAINT "PK_5e8cdd2f49eba06c113391a71a0" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "sub_contract_milestone_type_enum" AS ENUM('DEPOSIT', 'FINAL')`, undefined);
        await queryRunner.query(`CREATE TABLE "sub_contract_milestone" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "type" "sub_contract_milestone_type_enum" NOT NULL, "amount" integer NOT NULL, "paidAt" TIMESTAMP, "comment" character varying NOT NULL, "paymentIntentId" character varying NOT NULL DEFAULT '', "projectId" uuid, CONSTRAINT "PK_902968d06ea4242801d4d7c42ca" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "material_return_amounttype_enum" AS ENUM('BAGS', 'YARDS', 'ROLL', 'SQUARE_FEET', 'LINER_FEET', 'PALLETS', 'TUBES', 'UNIT')`, undefined);
        await queryRunner.query(`CREATE TABLE "material_return" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL DEFAULT '', "amount" character varying NOT NULL DEFAULT '', "amountType" "material_return_amounttype_enum", "brand" character varying NOT NULL DEFAULT '', "color" character varying NOT NULL DEFAULT '', "comment" character varying NOT NULL DEFAULT '', "projectId" uuid, CONSTRAINT "PK_394aa09c2048fb954c089756cf6" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "sub_contract_status_enum" AS ENUM('SITE_PLANNED', 'ACCEPTED', 'DECLINED', 'SITE_VISITED', 'EXCAVATED', 'GRADE_SET', 'BASE_INSTALLED', 'SCREEDED', 'HARDSCAPE_INSTALLED', 'ADJUSTED', 'CLEANED_UP', 'FINAL_PHOTOS_TAKEN', 'MATERIAL_RETURNED')`, undefined);
        await queryRunner.query(`CREATE TYPE "sub_contract_declinereasons_enum" AS ENUM('OVERLAP_PROJECTS', 'NO_CREW_AVAILABLE', 'OUT_OF_SERVICE_AREA_RADIUS', 'OTHER')`, undefined);
        await queryRunner.query(`CREATE TABLE "sub_contract" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "status" "sub_contract_status_enum", "gradePhotos" text array NOT NULL DEFAULT '{}'::text[], "gradeComment" character varying NOT NULL DEFAULT '', "baseInstallationPhotos" text array NOT NULL DEFAULT '{}'::text[], "baseInstallationComment" character varying NOT NULL DEFAULT '', "finalPhotos" text array NOT NULL DEFAULT '{}'::text[], "declineReasons" "sub_contract_declinereasons_enum" array NOT NULL DEFAULT '{}', "declineComment" character varying DEFAULT '', "contractorId" uuid, "sitePlanId" uuid, CONSTRAINT "REL_49af91480386d3d68810b551ef" UNIQUE ("sitePlanId"), CONSTRAINT "PK_17a77996bfd1242a850d918f514" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "contractor_profile_propertytypes_enum" AS ENUM('RESIDENTIAL', 'COMMERCIAL', 'MUNICIPALITY')`, undefined);
        await queryRunner.query(`CREATE TYPE "contractor_profile_servicetypes_enum" AS ENUM('STEPS', 'SITTING_WALL', 'PILLARS', 'LIGHTING', 'PATIO', 'RAISED_PATIO', 'WALKWAY', 'RETAINING_WALL', 'POOL_PATIO', 'FIRE_PIT', 'DRIVEWAY_PARKING', 'VENEER', 'FIREPLACE', 'OUTDOOR_KITCHEN', 'CLEANING_SANDING', 'MINOR_REPAIR', 'LANDSCAPING_PLANTS', 'OTHER')`, undefined);
        await queryRunner.query(`CREATE TYPE "contractor_profile_materialtypes_enum" AS ENUM('PAVERS', 'NATURAL_STONE', 'BLUE_STONE', 'GRANITE', 'BRICK', 'SRW_SYSTEMS', 'SLATE', 'FIELD_STONE', 'BOULDERS', 'CONCRETE', 'STAMPED_CONCRETE', 'SYNTHETIC_GRASS', 'MANUFACTURED_BLOCK', 'VENEER', 'OTHER')`, undefined);
        await queryRunner.query(`CREATE TYPE "contractor_profile_status_enum" AS ENUM('CREATED', 'BASIC_PROFILE_APPROVED', 'QUALITY_CHECK_PASSED', 'REPUTATION_CHECK_PASSED', 'SIGNED_LEGAL_TERMS', 'PAYMENT_VERIFIED', 'REJECTED')`, undefined);
        await queryRunner.query(`CREATE TYPE "contractor_profile_contractorclass_enum" AS ENUM('S', 'A', 'B', 'C')`, undefined);
        await queryRunner.query(`CREATE TABLE "contractor_profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "companyName" character varying NOT NULL DEFAULT '', "companyWebsite" character varying NOT NULL DEFAULT '', "propertyTypes" "contractor_profile_propertytypes_enum" array NOT NULL DEFAULT '{}', "serviceTypes" "contractor_profile_servicetypes_enum" array NOT NULL DEFAULT '{}', "materialTypes" "contractor_profile_materialtypes_enum" array NOT NULL DEFAULT '{}', "preferredBudget" int8range NOT NULL DEFAULT '[0,100000]', "businessComment" character varying NOT NULL DEFAULT '', "operationComment" character varying NOT NULL DEFAULT '', "timePerProject" character varying NOT NULL DEFAULT '', "instagramLink" character varying NOT NULL DEFAULT '', "facebookLink" character varying NOT NULL DEFAULT '', "googleBusinessLink" character varying NOT NULL DEFAULT '', "otherSocialLink" character varying NOT NULL DEFAULT '', "status" "contractor_profile_status_enum" NOT NULL DEFAULT 'CREATED', "contractorClass" "contractor_profile_contractorclass_enum", "nonCompleteAgreementSignedDate" TIMESTAMP, "ndaSignedDate" TIMESTAMP, "workingAgreementSignedDate" TIMESTAMP, "stripeCustomerId" character varying, PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "site_visit_preferredcolors_enum" AS ENUM('EARTH_TONE', 'BROWN', 'SHALE_GREY', 'CHAMPLAIN_GREY', 'ONYX_BLACK', 'DANVILLE_BLEND', 'SHERWOOD', 'CHESTNUT_BROWN', 'SANDLEWOOD', 'HICKORY', 'BEDFORD_BROWN')`, undefined);
        await queryRunner.query(`CREATE TABLE "site_visit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "attachments" text array, "manufacturer" character varying NOT NULL DEFAULT '', "productName" character varying NOT NULL DEFAULT '', "preferredColors" "site_visit_preferredcolors_enum" array NOT NULL DEFAULT '{}', "preferredSize" character varying NOT NULL DEFAULT '', "preferredTexture" character varying NOT NULL DEFAULT '', "preferredPrice" character varying NOT NULL DEFAULT '', "additionalDesign" character varying NOT NULL DEFAULT '', "machineAccess" jsonb, "soil" jsonb, "propertyGrade" jsonb, "drainage" jsonb, "exteriorUtilities" jsonb, "exteriorHazards" jsonb, "exteriorInconveniences" jsonb, "materialStorage" jsonb, "materialHaulOut" jsonb, "downspouts" jsonb, "shrubRemoval" jsonb, CONSTRAINT "PK_dff6f1caf7b5b14f31747b1c337" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "accessory_site_plan_type_enum" AS ENUM('STEPS', 'SITTING_WALL', 'PILLARS', 'LIGHTING', 'PATIO', 'RAISED_PATIO', 'WALKWAY', 'RETAINING_WALL', 'POOL_PATIO', 'FIRE_PIT', 'DRIVEWAY_PARKING', 'VENEER', 'FIREPLACE', 'OUTDOOR_KITCHEN', 'CLEANING_SANDING', 'MINOR_REPAIR', 'LANDSCAPING_PLANTS', 'OTHER')`, undefined);
        await queryRunner.query(`CREATE TYPE "accessory_site_plan_materialtypes_enum" AS ENUM('PAVERS', 'NATURAL_STONE', 'BLUE_STONE', 'GRANITE', 'BRICK', 'SRW_SYSTEMS', 'SLATE', 'FIELD_STONE', 'BOULDERS', 'CONCRETE', 'STAMPED_CONCRETE', 'SYNTHETIC_GRASS', 'MANUFACTURED_BLOCK', 'VENEER', 'OTHER')`, undefined);
        await queryRunner.query(`CREATE TABLE "accessory_site_plan" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "type" "accessory_site_plan_type_enum" NOT NULL, "materialTypes" "accessory_site_plan_materialtypes_enum" array NOT NULL DEFAULT '{}', "comment" character varying NOT NULL DEFAULT '', "attachments" text array NOT NULL DEFAULT '{}'::text[], CONSTRAINT "PK_37df68b7479eaf3a154f6b8cb03" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "portfolio" DROP COLUMN "materials"`, undefined);
        await queryRunner.query(`DROP TYPE "public"."portfolio_materials_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "portfolio" DROP COLUMN "address"`, undefined);
        await queryRunner.query(`ALTER TABLE "portfolio" DROP COLUMN "email"`, undefined);
        await queryRunner.query(`ALTER TABLE "portfolio" DROP COLUMN "phone"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "contractorProfileId" uuid`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e72528f4484a73df51e7578d54f" UNIQUE ("contractorProfileId")`, undefined);
        await queryRunner.query(`ALTER TABLE "portfolio" ADD "attachments" text array NOT NULL DEFAULT '{}'::text[]`, undefined);
        await queryRunner.query(`ALTER TABLE "portfolio" ADD "contractorProfileId" uuid`, undefined);
        await queryRunner.query(`ALTER TABLE "image_attachment" ADD "portfolioId" uuid`, undefined);
        await queryRunner.query(`ALTER TABLE "project" ADD "contractorId" uuid`, undefined);
        await queryRunner.query(`ALTER TABLE "project" ADD "siteVisitId" uuid`, undefined);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "UQ_ab90f8589ffa137a2f4476d992d" UNIQUE ("siteVisitId")`, undefined);
        await queryRunner.query(`ALTER TABLE "project" ADD "subContractId" uuid`, undefined);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "UQ_c0ce342fddcb5299f0e0acb7c0f" UNIQUE ("subContractId")`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "type" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "readAt" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "image" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "meta" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "avatar" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeCustomerId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TYPE "public"."email_log_type_enum" RENAME TO "email_log_type_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "email_log_type_enum" AS ENUM('CONFIRM_REGISTER', 'MESSAGE_RECEIVED', 'RESET_PASSWORD', 'INVITATION', 'PROJECT_CREATED', 'ESTIMATE_READY', 'ESTIMATE_UPDATED', 'SITE_VISIT_SCHEDULED', 'SITE_VISIT_REMINDER_FOR_CUSTOMER', 'SITE_VISIT_SCHEDULE_CHANGED', 'RECEIVED_FINAL_PROPOSAL', 'FINAL_PROPOSAL_UPDATED', 'FINAL_PROPOSAL_ACCEPTED', 'MILESTONE_PAYMENT_REQUESTED', 'RECEIVED_MILESTONE_PAYMENT', 'PICK_PAVERS_SCHEDULED', 'PICK_PAVERS_SCHEDULE_CHANGED', 'FINAL_MILESTONE_PAYMENT_REQUESTED', 'FINAL_MILESTONE_MODIFIED', 'TESTIMONIAL_REQUEST', 'DEPOSIT_MILESTONE_UPDATED', 'RECEIVED_FINAL_MILESTONE_WITH_HOLD', 'LEGAL_TERMS_SIGN_REMINDER', 'PAYMENT_SETUP_REMINDER', 'NEW_PROJECT_REGISTERED', 'ESTIMATE_REMINDER', 'ESTIMATE_ACCEPTED', 'SITE_VISIT_REMINDER_FOR_CONSULTANT', 'SUBMIT_PROPOSAL_REMINDER', 'DEPOSIT_MADE', 'MILESTONE_PAID', 'CONTRACT_READY', 'CONTRACT_SIGNED', 'SITE_VISIT_SCHEDULE_CHANGE_REQUEST', 'PICK_PAVERS_SCHEDULE_CHANGE_REQUEST', 'ESTIMATE_DECLINED', 'FINAL_PROPOSAL_DECLINED', 'CHANGE_EMAIL')`, undefined);
        await queryRunner.query(`ALTER TABLE "email_log" ALTER COLUMN "type" TYPE "email_log_type_enum" USING "type"::"text"::"email_log_type_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "email_log_type_enum_old"`, undefined);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "attachments" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "readAt" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "job" ALTER COLUMN "hardSkills" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "job" ALTER COLUMN "softSkills" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "cv" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "log_rocket_recording" ALTER COLUMN "email" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "log_rocket_recording" ALTER COLUMN "firstName" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "log_rocket_recording" ALTER COLUMN "lastName" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "page_visit_history" ALTER COLUMN "sub" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_55a8a8099e8b1aede86bca03bf6" FOREIGN KEY ("consultantProfileId") REFERENCES "consultant_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_e72528f4484a73df51e7578d54f" FOREIGN KEY ("contractorProfileId") REFERENCES "contractor_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "cost_item" ADD CONSTRAINT "FK_ea988f9af0473bb232b332962a5" FOREIGN KEY ("sitePlanId") REFERENCES "site_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "custom_payment_item" ADD CONSTRAINT "FK_ceee0f3361f81074aa07b563562" FOREIGN KEY ("sitePlanId") REFERENCES "site_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "accessory_material_detail" ADD CONSTRAINT "FK_8614c09c907f75c8a2b3d0ddf69" FOREIGN KEY ("sitePlanId") REFERENCES "site_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract_milestone" ADD CONSTRAINT "FK_d1dc61dfb2ff671c2fe031cd087" FOREIGN KEY ("projectId") REFERENCES "sub_contract"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "material_return" ADD CONSTRAINT "FK_b0cc4cb329ccd4e39a6a7493280" FOREIGN KEY ("projectId") REFERENCES "sub_contract"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ADD CONSTRAINT "FK_6294e6e3b37d3da1e2e4668a2b4" FOREIGN KEY ("contractorId") REFERENCES "contractor_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" ADD CONSTRAINT "FK_49af91480386d3d68810b551efa" FOREIGN KEY ("sitePlanId") REFERENCES "site_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "portfolio" ADD CONSTRAINT "FK_3fa9e4e4964dd1cb6f7b9c8de10" FOREIGN KEY ("contractorProfileId") REFERENCES "contractor_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "image_attachment" ADD CONSTRAINT "FK_da1bf779ad61c59dd827cfd07c2" FOREIGN KEY ("portfolioId") REFERENCES "portfolio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_0d5c3ce7aea0165344788512c60" FOREIGN KEY ("consultantId") REFERENCES "consultant_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_bd374c8eb325f260166479c2518" FOREIGN KEY ("contractorId") REFERENCES "contractor_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_ab90f8589ffa137a2f4476d992d" FOREIGN KEY ("siteVisitId") REFERENCES "site_visit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_c0ce342fddcb5299f0e0acb7c0f" FOREIGN KEY ("subContractId") REFERENCES "sub_contract"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_c0ce342fddcb5299f0e0acb7c0f"`, undefined);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_ab90f8589ffa137a2f4476d992d"`, undefined);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_bd374c8eb325f260166479c2518"`, undefined);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_0d5c3ce7aea0165344788512c60"`, undefined);
        await queryRunner.query(`ALTER TABLE "image_attachment" DROP CONSTRAINT "FK_da1bf779ad61c59dd827cfd07c2"`, undefined);
        await queryRunner.query(`ALTER TABLE "portfolio" DROP CONSTRAINT "FK_3fa9e4e4964dd1cb6f7b9c8de10"`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" DROP CONSTRAINT "FK_49af91480386d3d68810b551efa"`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract" DROP CONSTRAINT "FK_6294e6e3b37d3da1e2e4668a2b4"`, undefined);
        await queryRunner.query(`ALTER TABLE "material_return" DROP CONSTRAINT "FK_b0cc4cb329ccd4e39a6a7493280"`, undefined);
        await queryRunner.query(`ALTER TABLE "sub_contract_milestone" DROP CONSTRAINT "FK_d1dc61dfb2ff671c2fe031cd087"`, undefined);
        await queryRunner.query(`ALTER TABLE "accessory_material_detail" DROP CONSTRAINT "FK_8614c09c907f75c8a2b3d0ddf69"`, undefined);
        await queryRunner.query(`ALTER TABLE "custom_payment_item" DROP CONSTRAINT "FK_ceee0f3361f81074aa07b563562"`, undefined);
        await queryRunner.query(`ALTER TABLE "cost_item" DROP CONSTRAINT "FK_ea988f9af0473bb232b332962a5"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_e72528f4484a73df51e7578d54f"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_55a8a8099e8b1aede86bca03bf6"`, undefined);
        await queryRunner.query(`ALTER TABLE "page_visit_history" ALTER COLUMN "sub" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "log_rocket_recording" ALTER COLUMN "lastName" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "log_rocket_recording" ALTER COLUMN "firstName" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "log_rocket_recording" ALTER COLUMN "email" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "applicant" ALTER COLUMN "cv" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "job" ALTER COLUMN "softSkills" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "job" ALTER COLUMN "hardSkills" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "readAt" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "attachments" DROP DEFAULT`, undefined);
        await queryRunner.query(`CREATE TYPE "email_log_type_enum_old" AS ENUM('CONFIRM_REGISTER', 'MESSAGE_RECEIVED', 'RESET_PASSWORD', 'INVITATION', 'PROJECT_CREATED', 'ESTIMATE_READY', 'ESTIMATE_UPDATED', 'SITE_VISIT_SCHEDULED', 'SITE_VISIT_REMINDER_FOR_CUSTOMER', 'SITE_VISIT_SCHEDULE_CHANGED', 'RECEIVED_FINAL_PROPOSAL', 'FINAL_PROPOSAL_UPDATED', 'FINAL_PROPOSAL_ACCEPTED', 'MILESTONE_PAYMENT_REQUESTED', 'RECEIVED_MILESTONE_PAYMENT', 'PICK_PAVERS_SCHEDULED', 'PICK_PAVERS_SCHEDULE_CHANGED', 'FINAL_MILESTONE_PAYMENT_REQUESTED', 'FINAL_MILESTONE_MODIFIED', 'TESTIMONIAL_REQUEST', 'DEPOSIT_MILESTONE_UPDATED', 'RECEIVED_FINAL_MILESTONE_WITH_HOLD', 'NEW_PROJECT_REGISTERED', 'ESTIMATE_REMINDER', 'ESTIMATE_ACCEPTED', 'SITE_VISIT_REMINDER_FOR_CONSULTANT', 'SUBMIT_PROPOSAL_REMINDER', 'DEPOSIT_MADE', 'MILESTONE_PAID', 'CONTRACT_READY', 'CONTRACT_SIGNED', 'SITE_VISIT_SCHEDULE_CHANGE_REQUEST', 'PICK_PAVERS_SCHEDULE_CHANGE_REQUEST', 'ESTIMATE_DECLINED', 'FINAL_PROPOSAL_DECLINED', 'CHANGE_EMAIL')`, undefined);
        await queryRunner.query(`ALTER TABLE "email_log" ALTER COLUMN "type" TYPE "email_log_type_enum_old" USING "type"::"text"::"email_log_type_enum_old"`, undefined);
        await queryRunner.query(`DROP TYPE "email_log_type_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "email_log_type_enum_old" RENAME TO  "email_log_type_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeCustomerId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "avatar" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "meta" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "image" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "readAt" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "type" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "UQ_c0ce342fddcb5299f0e0acb7c0f"`, undefined);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "subContractId"`, undefined);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "UQ_ab90f8589ffa137a2f4476d992d"`, undefined);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "siteVisitId"`, undefined);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "contractorId"`, undefined);
        await queryRunner.query(`ALTER TABLE "image_attachment" DROP COLUMN "portfolioId"`, undefined);
        await queryRunner.query(`ALTER TABLE "portfolio" DROP COLUMN "contractorProfileId"`, undefined);
        await queryRunner.query(`ALTER TABLE "portfolio" DROP COLUMN "attachments"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e72528f4484a73df51e7578d54f"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "contractorProfileId"`, undefined);
        await queryRunner.query(`ALTER TABLE "portfolio" ADD "phone" character varying NOT NULL DEFAULT ''`, undefined);
        await queryRunner.query(`ALTER TABLE "portfolio" ADD "email" character varying NOT NULL DEFAULT ''`, undefined);
        await queryRunner.query(`ALTER TABLE "portfolio" ADD "address" character varying NOT NULL DEFAULT ''`, undefined);
        await queryRunner.query(`CREATE TYPE "public"."portfolio_materials_enum" AS ENUM('PAVERS', 'NATURAL_STONE', 'BLUE_STONE', 'GRANITE', 'BRICK', 'SRW_SYSTEMS', 'SLATE', 'FIELD_STONE', 'BOULDERS', 'CONCRETE', 'STAMPED_CONCRETE', 'SYNTHETIC_GRASS', 'MANUFACTURED_BLOCK', 'VENEER', 'OTHER')`, undefined);
        await queryRunner.query(`ALTER TABLE "portfolio" ADD "materials" "portfolio_materials_enum" array NOT NULL`, undefined);
        await queryRunner.query(`DROP TABLE "accessory_site_plan"`, undefined);
        await queryRunner.query(`DROP TYPE "accessory_site_plan_materialtypes_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "accessory_site_plan_type_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "site_visit"`, undefined);
        await queryRunner.query(`DROP TYPE "site_visit_preferredcolors_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "contractor_profile"`, undefined);
        await queryRunner.query(`DROP TYPE "contractor_profile_contractorclass_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "contractor_profile_status_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "contractor_profile_materialtypes_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "contractor_profile_servicetypes_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "contractor_profile_propertytypes_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "sub_contract"`, undefined);
        await queryRunner.query(`DROP TYPE "sub_contract_declinereasons_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "sub_contract_status_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "material_return"`, undefined);
        await queryRunner.query(`DROP TYPE "material_return_amounttype_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "sub_contract_milestone"`, undefined);
        await queryRunner.query(`DROP TYPE "sub_contract_milestone_type_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "site_plan"`, undefined);
        await queryRunner.query(`DROP TABLE "accessory_material_detail"`, undefined);
        await queryRunner.query(`DROP TYPE "accessory_material_detail_materials_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "accessory_material_detail_type_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "custom_payment_item"`, undefined);
        await queryRunner.query(`DROP TYPE "custom_payment_item_type_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "cost_item"`, undefined);
        await queryRunner.query(`DROP TYPE "cost_item_type_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_bd374c8eb325f260166479c2518" FOREIGN KEY ("consultantId") REFERENCES "consultant_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_e72528f4484a73df51e7578d54f" FOREIGN KEY ("consultantProfileId") REFERENCES "consultant_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
