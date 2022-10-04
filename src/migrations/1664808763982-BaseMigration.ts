import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigration1664808763982 implements MigrationInterface {
    name = 'BaseMigration1664808763982'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customer_manager" ("id" SERIAL NOT NULL, "customerId" integer NOT NULL, "managerId" integer NOT NULL, "subcribeDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5826dc4c01417373d0551f2d296" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_language_enum" AS ENUM('en', 'fr')`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('ADMIN', 'MODERATOR', 'MANAGER', 'CUSTOMER')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "avatar" character varying NOT NULL DEFAULT '/user_default.png', "language" "public"."user_language_enum" NOT NULL DEFAULT 'en', "role" "public"."user_role_enum" NOT NULL DEFAULT 'CUSTOMER', "phone" character varying, "address" character varying, "token" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "promotion" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text, "image" character varying NOT NULL DEFAULT '/promo_default.png', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_fab3630e0789a2002f1cadb7d38" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "customer_manager" ADD CONSTRAINT "FK_1e9a0ca89b14ab96329fdda479f" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_manager" ADD CONSTRAINT "FK_2a66ba2ffc826208098c6c9bbb0" FOREIGN KEY ("managerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "promotion" ADD CONSTRAINT "FK_2e7a151d1ec84a16d7a00cda728" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "promotion" DROP CONSTRAINT "FK_2e7a151d1ec84a16d7a00cda728"`);
        await queryRunner.query(`ALTER TABLE "customer_manager" DROP CONSTRAINT "FK_2a66ba2ffc826208098c6c9bbb0"`);
        await queryRunner.query(`ALTER TABLE "customer_manager" DROP CONSTRAINT "FK_1e9a0ca89b14ab96329fdda479f"`);
        await queryRunner.query(`DROP TABLE "promotion"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_language_enum"`);
        await queryRunner.query(`DROP TABLE "customer_manager"`);
    }

}
