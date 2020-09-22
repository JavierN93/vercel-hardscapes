import {MigrationInterface, QueryRunner} from "typeorm";

export class RenameSubContractorAgreementSignedDate1599434745819 implements MigrationInterface {
    name = 'RenameSubContractorAgreementSignedDate1599434745819'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contractor_profile" RENAME COLUMN "subContractorAgreementDate" TO "subContractorAgreementSignedDate"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contractor_profile" RENAME COLUMN "subContractorAgreementSignedDate" TO "subContractorAgreementDate"`, undefined);
    }

}
