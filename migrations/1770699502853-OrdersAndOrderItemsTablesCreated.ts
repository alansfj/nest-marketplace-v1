import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrdersAndOrderItemsTablesCreated1770699502853
  implements MigrationInterface
{
  name = 'OrdersAndOrderItemsTablesCreated1770699502853';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."orders_status_enum" AS ENUM('CART', 'PAID', 'REFUNDED')
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."orders_currency_enum" AS ENUM('MXN', 'USD')
        `);
    await queryRunner.query(`
            CREATE TABLE "orders" (
                "id" SERIAL NOT NULL,
                "status" "public"."orders_status_enum" NOT NULL DEFAULT 'CART',
                "subtotalAmount" numeric(11, 2) NOT NULL,
                "totalAmount" numeric(11, 2) NOT NULL,
                "currency" "public"."orders_currency_enum" NOT NULL DEFAULT 'MXN',
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedDate" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedDate" TIMESTAMP,
                "userId" integer NOT NULL,
                CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."order_items_currency_enum" AS ENUM('MXN', 'USD')
        `);
    await queryRunner.query(`
            CREATE TABLE "order_items" (
                "id" SERIAL NOT NULL,
                "productName" character varying(150) NOT NULL,
                "price" numeric(11, 2) NOT NULL,
                "quantity" integer NOT NULL,
                "currency" "public"."order_items_currency_enum" NOT NULL DEFAULT 'MXN',
                "subtotalAmount" numeric(11, 2) NOT NULL,
                "totalAmount" numeric(11, 2) NOT NULL,
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedDate" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedDate" TIMESTAMP,
                "orderId" integer NOT NULL,
                "productId" integer NOT NULL,
                CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "order_items"
            ADD CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "order_items"
            ADD CONSTRAINT "FK_cdb99c05982d5191ac8465ac010" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "order_items" DROP CONSTRAINT "FK_cdb99c05982d5191ac8465ac010"
        `);
    await queryRunner.query(`
            ALTER TABLE "order_items" DROP CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1"
        `);
    await queryRunner.query(`
            DROP TABLE "order_items"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."order_items_currency_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "orders"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."orders_currency_enum"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."orders_status_enum"
        `);
  }
}
