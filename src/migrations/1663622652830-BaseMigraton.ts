import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigraton1663622652830 implements MigrationInterface {
    name = 'BaseMigraton1663622652830'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_language_enum" AS ENUM('en', 'fr')`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('ADMIN', 'MODERATOR', 'MANAGER', 'CUSTOMER')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "avatar" character varying NOT NULL DEFAULT '/user_default.png', "language" "public"."user_language_enum" NOT NULL DEFAULT 'en', "role" "public"."user_role_enum" NOT NULL DEFAULT 'CUSTOMER', "phone" character varying, "address" character varying, "token" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "promotion" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text, "image" character varying NOT NULL DEFAULT '/promo_default.png', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_fab3630e0789a2002f1cadb7d38" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_managers_user" ("userId_1" integer NOT NULL, "userId_2" integer NOT NULL, CONSTRAINT "PK_ddf82f2123cec96b8059c8220df" PRIMARY KEY ("userId_1", "userId_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b5e689010d22c66273c4b8be09" ON "user_managers_user" ("userId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_bbe004b9ee2b70afdaf6794577" ON "user_managers_user" ("userId_2") `);
        await queryRunner.query(`ALTER TABLE "promotion" ADD CONSTRAINT "FK_2e7a151d1ec84a16d7a00cda728" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_managers_user" ADD CONSTRAINT "FK_b5e689010d22c66273c4b8be09f" FOREIGN KEY ("userId_1") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_managers_user" ADD CONSTRAINT "FK_bbe004b9ee2b70afdaf6794577f" FOREIGN KEY ("userId_2") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_managers_user" DROP CONSTRAINT "FK_bbe004b9ee2b70afdaf6794577f"`);
        await queryRunner.query(`ALTER TABLE "user_managers_user" DROP CONSTRAINT "FK_b5e689010d22c66273c4b8be09f"`);
        await queryRunner.query(`ALTER TABLE "promotion" DROP CONSTRAINT "FK_2e7a151d1ec84a16d7a00cda728"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bbe004b9ee2b70afdaf6794577"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b5e689010d22c66273c4b8be09"`);
        await queryRunner.query(`DROP TABLE "user_managers_user"`);
        await queryRunner.query(`DROP TABLE "promotion"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_language_enum"`);
    }

}
