import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveNetworkContractor1596986271181 implements MigrationInterface {
    name = 'RemoveNetworkContractor1596986271181';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "network_contractor"`, undefined);
        await queryRunner.query(`DROP TABLE "network_contractor_category"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "network_contractor" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "companyName" character varying NOT NULL, "address" character varying NOT NULL, "contacts" character varying NOT NULL, "website" character varying NOT NULL, "serviceDescription" character varying NOT NULL, "logoUrl" character varying NOT NULL, "categoryId" uuid, CONSTRAINT "PK_cc189ad1fecb9e2c7c4e9769912" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "network_contractor_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "published" boolean NOT NULL, CONSTRAINT "PK_b5b819a747b262666199f2f0f5d" PRIMARY KEY ("id"))`, undefined);
    }

}
