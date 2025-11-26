import { MigrationInterface, QueryRunner } from 'typeorm';

export class DefaultBalanceZero1764121413933 implements MigrationInterface {
  name = 'DefaultBalanceZero1764121413933';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_balance"
            ALTER COLUMN "balance"
            SET DEFAULT '0'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_balance"
            ALTER COLUMN "balance" DROP DEFAULT
        `);
  }
}
