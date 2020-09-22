import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameRoleContractorToConsultant1596908013582 implements MigrationInterface {
    name = 'RenameRoleContractorToConsultant1596908013582';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."user_role_enum" RENAME TO "user_role_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "user_role_enum" AS ENUM('SUPER_ADMIN', 'CONSULTANT', 'CUSTOMER', 'CONTRACTOR')`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" TYPE "user_role_enum" USING "role"::"text"::"user_role_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "user_role_enum_old"`, undefined);
        await queryRunner.query(`UPDATE "user" SET role='CONSULTANT' where role='CONTRACTOR'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "user" SET role='CONTRACTOR' where role='CONSULTANT'`, undefined);
        await queryRunner.query(`CREATE TYPE "user_role_enum_old" AS ENUM('SUPER_ADMIN', 'CONTRACTOR', 'CUSTOMER')`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" TYPE "user_role_enum_old" USING "role"::"text"::"user_role_enum_old"`, undefined);
        await queryRunner.query(`DROP TYPE "user_role_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "user_role_enum_old" RENAME TO  "user_role_enum"`, undefined);
    }

}
