import { MigrationInterface, QueryRunner } from 'typeorm';

export class NotNullableRelations1763087683810 implements MigrationInterface {
  name = 'NotNullableRelations1763087683810';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "subcategories" DROP CONSTRAINT "FK_d1fe096726c3c5b8a500950e448"
        `);
    await queryRunner.query(`
            ALTER TABLE "subcategories"
            ALTER COLUMN "categoryId"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "stores" DROP CONSTRAINT "FK_f36d697e265ed99b80cae6984c9"
        `);
    await queryRunner.query(`
            ALTER TABLE "stores"
            ALTER COLUMN "userId"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "subcategories"
            ADD CONSTRAINT "FK_d1fe096726c3c5b8a500950e448" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "stores"
            ADD CONSTRAINT "FK_f36d697e265ed99b80cae6984c9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "stores" DROP CONSTRAINT "FK_f36d697e265ed99b80cae6984c9"
        `);
    await queryRunner.query(`
            ALTER TABLE "subcategories" DROP CONSTRAINT "FK_d1fe096726c3c5b8a500950e448"
        `);
    await queryRunner.query(`
            ALTER TABLE "stores"
            ALTER COLUMN "userId" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "stores"
            ADD CONSTRAINT "FK_f36d697e265ed99b80cae6984c9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "subcategories"
            ALTER COLUMN "categoryId" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "subcategories"
            ADD CONSTRAINT "FK_d1fe096726c3c5b8a500950e448" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
