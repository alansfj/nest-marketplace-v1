import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserBalanceTableCreatedAndAddedColumnsToUserTable1764121140939
  implements MigrationInterface
{
  name = 'UserBalanceTableCreatedAndAddedColumnsToUserTable1764121140939';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."user_balance_currency_enum" AS ENUM('MXN', 'USD')
        `);
    await queryRunner.query(`
            CREATE TABLE "user_balance" (
                "id" SERIAL NOT NULL,
                "balance" numeric(11, 2) NOT NULL,
                "currency" "public"."user_balance_currency_enum" NOT NULL DEFAULT 'MXN',
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedDate" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedDate" TIMESTAMP,
                "userId" integer NOT NULL,
                CONSTRAINT "REL_4cac061e709256ecb43cc39d3f" UNIQUE ("userId"),
                CONSTRAINT "PK_f3edf5a1907e7b430421b9c2ddd" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "createdDate" TIMESTAMP NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "updatedDate" TIMESTAMP NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "deletedDate" TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE "products" DROP COLUMN "currency"
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."products_currency_enum" AS ENUM('MXN', 'USD')
        `);
    await queryRunner.query(`
            ALTER TABLE "products"
            ADD "currency" "public"."products_currency_enum" NOT NULL DEFAULT 'MXN'
        `);
    await queryRunner.query(`
            ALTER TABLE "user_balance"
            ADD CONSTRAINT "FK_4cac061e709256ecb43cc39d3f4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_balance" DROP CONSTRAINT "FK_4cac061e709256ecb43cc39d3f4"
        `);
    await queryRunner.query(`
            ALTER TABLE "products" DROP COLUMN "currency"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."products_currency_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "products"
            ADD "currency" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "deletedDate"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "updatedDate"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "createdDate"
        `);
    await queryRunner.query(`
            DROP TABLE "user_balance"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."user_balance_currency_enum"
        `);
  }
}
