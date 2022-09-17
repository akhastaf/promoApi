import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigration1663381485605 implements MigrationInterface {
    name = 'BaseMigration1663381485605'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "promotion" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text, "image" character varying NOT NULL DEFAULT '/promo_default.png', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_fab3630e0789a2002f1cadb7d38" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('ADMIN', 'MODERATOR', 'MANAGER', 'CUSTOMER')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "middle_name" character varying, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "avatar" character varying NOT NULL DEFAULT '/user_default.png', "role" "public"."user_role_enum" NOT NULL DEFAULT 'CUSTOMER', "phone" character varying, "address" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_customers_user" ("userId_1" integer NOT NULL, "userId_2" integer NOT NULL, CONSTRAINT "PK_95c884d9d5452a38542299eab4e" PRIMARY KEY ("userId_1", "userId_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_de16a526040e905f22536f0c8b" ON "user_customers_user" ("userId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_191c9d5fcfc6f45ceee6da8b68" ON "user_customers_user" ("userId_2") `);
        await queryRunner.query(`ALTER TABLE "promotion" ADD CONSTRAINT "FK_2e7a151d1ec84a16d7a00cda728" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_customers_user" ADD CONSTRAINT "FK_de16a526040e905f22536f0c8b2" FOREIGN KEY ("userId_1") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_customers_user" ADD CONSTRAINT "FK_191c9d5fcfc6f45ceee6da8b68c" FOREIGN KEY ("userId_2") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_customers_user" DROP CONSTRAINT "FK_191c9d5fcfc6f45ceee6da8b68c"`);
        await queryRunner.query(`ALTER TABLE "user_customers_user" DROP CONSTRAINT "FK_de16a526040e905f22536f0c8b2"`);
        await queryRunner.query(`ALTER TABLE "promotion" DROP CONSTRAINT "FK_2e7a151d1ec84a16d7a00cda728"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_191c9d5fcfc6f45ceee6da8b68"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_de16a526040e905f22536f0c8b"`);
        await queryRunner.query(`DROP TABLE "user_customers_user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "promotion"`);
    }

}
