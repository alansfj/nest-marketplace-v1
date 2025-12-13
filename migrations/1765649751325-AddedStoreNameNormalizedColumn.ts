import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedStoreNameNormalizedColumn1765649751325
  implements MigrationInterface
{
  name = 'AddedStoreNameNormalizedColumn1765649751325';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "stores"
            ADD "nameNormalized" character varying(100) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "stores"
            ADD CONSTRAINT "UQ_3dbc1dcc6c30b57310e58c6538f" UNIQUE ("nameNormalized")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "stores" DROP CONSTRAINT "UQ_3dbc1dcc6c30b57310e58c6538f"
        `);
    await queryRunner.query(`
            ALTER TABLE "stores" DROP COLUMN "nameNormalized"
        `);
  }
}
