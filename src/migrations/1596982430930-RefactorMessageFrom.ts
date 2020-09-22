import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorMessageFrom1596982430930 implements MigrationInterface {
    name = 'RefactorMessageFrom1596982430930';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."message_from_enum" RENAME TO "message_from_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "message_from_enum" AS ENUM('FROM_CONSULTANT', 'FROM_CONTRACTOR', 'FROM_CUSTOMER')`, undefined);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "from" TYPE "message_from_enum" USING "from"::"text"::"message_from_enum"`, undefined);
        await queryRunner.query(`UPDATE "message" SET "from"='FROM_CONSULTANT' where "from"='FROM_CONTRACTOR'`, undefined);
        await queryRunner.query(`DROP TYPE "message_from_enum_old"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "message_from_enum_old" AS ENUM('FROM_CONTRACTOR', 'FROM_CUSTOMER')`, undefined);
        await queryRunner.query(`UPDATE "message" SET "from"='FROM_CONTRACTOR' where "from"='FROM_CONSULTANT'`, undefined);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "from" TYPE "message_from_enum_old" USING "from"::"text"::"message_from_enum_old"`, undefined);
        await queryRunner.query(`DROP TYPE "message_from_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "message_from_enum_old" RENAME TO "message_from_enum"`, undefined);
    }

}
