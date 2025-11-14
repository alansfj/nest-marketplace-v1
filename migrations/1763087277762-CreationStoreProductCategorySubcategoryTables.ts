import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreationStoreProductCategorySubcategoryTables1763087277762
  implements MigrationInterface
{
  name = 'CreationStoreProductCategorySubcategoryTables1763087277762';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "categories" (
                "id" SERIAL NOT NULL,
                "name" character varying(50) NOT NULL,
                CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"),
                CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "subcategories" (
                "id" SERIAL NOT NULL,
                "name" character varying(50) NOT NULL,
                "categoryId" integer,
                CONSTRAINT "UQ_d1a3a67c9c5d440edf414af1271" UNIQUE ("name"),
                CONSTRAINT "PK_793ef34ad0a3f86f09d4837007c" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "products" (
                "id" SERIAL NOT NULL,
                "name" character varying(150) NOT NULL,
                "description" text NOT NULL,
                "price" numeric(11, 2) NOT NULL,
                "currency" character varying NOT NULL,
                "quantity" integer NOT NULL,
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedDate" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedDate" TIMESTAMP,
                "storeId" integer NOT NULL,
                "subcategoryId" integer NOT NULL,
                "userId" integer NOT NULL,
                CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "stores" (
                "id" SERIAL NOT NULL,
                "name" character varying(100) NOT NULL,
                "description" text NOT NULL,
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedDate" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedDate" TIMESTAMP,
                "userId" integer,
                CONSTRAINT "UQ_a205ca5a37fa5e10005f003aaf3" UNIQUE ("name"),
                CONSTRAINT "PK_7aa6e7d71fa7acdd7ca43d7c9cb" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "stores_categories_categories" (
                "storesId" integer NOT NULL,
                "categoriesId" integer NOT NULL,
                CONSTRAINT "PK_bcc15d5bd66a845d6c14f76f12b" PRIMARY KEY ("storesId", "categoriesId")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_0375955ae147441574b5d9c6c0" ON "stores_categories_categories" ("storesId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_8bc7f8e70635afab75f8f9ab2a" ON "stores_categories_categories" ("categoriesId")
        `);
    await queryRunner.query(`
            ALTER TABLE "subcategories"
            ADD CONSTRAINT "FK_d1fe096726c3c5b8a500950e448" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "products"
            ADD CONSTRAINT "FK_782da5e50e94b763eb63225d69d" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "products"
            ADD CONSTRAINT "FK_7527f75cb36bea4b7f2b86f7d1d" FOREIGN KEY ("subcategoryId") REFERENCES "subcategories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "products"
            ADD CONSTRAINT "FK_99d90c2a483d79f3b627fb1d5e9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "stores"
            ADD CONSTRAINT "FK_f36d697e265ed99b80cae6984c9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "stores_categories_categories"
            ADD CONSTRAINT "FK_0375955ae147441574b5d9c6c02" FOREIGN KEY ("storesId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "stores_categories_categories"
            ADD CONSTRAINT "FK_8bc7f8e70635afab75f8f9ab2a3" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "stores_categories_categories" DROP CONSTRAINT "FK_8bc7f8e70635afab75f8f9ab2a3"
        `);
    await queryRunner.query(`
            ALTER TABLE "stores_categories_categories" DROP CONSTRAINT "FK_0375955ae147441574b5d9c6c02"
        `);
    await queryRunner.query(`
            ALTER TABLE "stores" DROP CONSTRAINT "FK_f36d697e265ed99b80cae6984c9"
        `);
    await queryRunner.query(`
            ALTER TABLE "products" DROP CONSTRAINT "FK_99d90c2a483d79f3b627fb1d5e9"
        `);
    await queryRunner.query(`
            ALTER TABLE "products" DROP CONSTRAINT "FK_7527f75cb36bea4b7f2b86f7d1d"
        `);
    await queryRunner.query(`
            ALTER TABLE "products" DROP CONSTRAINT "FK_782da5e50e94b763eb63225d69d"
        `);
    await queryRunner.query(`
            ALTER TABLE "subcategories" DROP CONSTRAINT "FK_d1fe096726c3c5b8a500950e448"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_8bc7f8e70635afab75f8f9ab2a"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_0375955ae147441574b5d9c6c0"
        `);
    await queryRunner.query(`
            DROP TABLE "stores_categories_categories"
        `);
    await queryRunner.query(`
            DROP TABLE "stores"
        `);
    await queryRunner.query(`
            DROP TABLE "products"
        `);
    await queryRunner.query(`
            DROP TABLE "subcategories"
        `);
    await queryRunner.query(`
            DROP TABLE "categories"
        `);
  }
}
