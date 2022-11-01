import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigration1667319781813 implements MigrationInterface {
    name = 'BaseMigration1667319781813'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "promotion" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_fab3630e0789a2002f1cadb7d38" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customers" ("id" SERIAL NOT NULL, "full_name" character varying NOT NULL, "phone" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "storeId" integer, CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_language_enum" AS ENUM('en', 'fr')`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('ADMIN', 'SALESMAN', 'STORE', 'ALL')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "avatar" character varying NOT NULL DEFAULT 'public/default.png', "language" "public"."user_language_enum" NOT NULL DEFAULT 'en', "role" "public"."user_role_enum" NOT NULL, "phone" character varying, "address" character varying, "token" character varying, "isActive" boolean NOT NULL DEFAULT false, "count" integer NOT NULL DEFAULT '0', "number_twilio" character varying, "number_sid" character varying, "service_name" character varying, "service_sid" character varying, "notify_name" character varying, "notify_sid" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "salesmanId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "promotion" ADD CONSTRAINT "FK_2e7a151d1ec84a16d7a00cda728" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_b7837678f3d750698394a80f70a" FOREIGN KEY ("storeId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_0c2ecf83c89ca3d7343c4368f77" FOREIGN KEY ("salesmanId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_0c2ecf83c89ca3d7343c4368f77"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_b7837678f3d750698394a80f70a"`);
        await queryRunner.query(`ALTER TABLE "promotion" DROP CONSTRAINT "FK_2e7a151d1ec84a16d7a00cda728"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_language_enum"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP TABLE "promotion"`);
    }

}
