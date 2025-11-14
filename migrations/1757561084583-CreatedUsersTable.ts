import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatedUsersTable1757561084583 implements MigrationInterface {
  name = 'CreatedUsersTable1757561084583';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL,
                "email" character varying(100) NOT NULL,
                "firstName" character varying(50) NOT NULL,
                "lastName" character varying(50) NOT NULL,
                "password" character varying NOT NULL,
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "users"
        `);
  }
}
