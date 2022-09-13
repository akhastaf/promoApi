import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigraton1663103283756 implements MigrationInterface {
    name = 'BaseMigraton1663103283756'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "promotion" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text, "image" character varying NOT NULL DEFAULT '/promo_default.png', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_fab3630e0789a2002f1cadb7d38" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "middle_name" character varying, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isAdmin" boolean NOT NULL DEFAULT false, "avatar" character varying NOT NULL DEFAULT '/user_default.png', "promotions" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer" ("id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "middle_name" character varying, "last_name" character varying NOT NULL, "email" character varying, "phone" character varying NOT NULL, "avatar" character varying NOT NULL DEFAULT '/customer_default.png', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_customers_customer" ("userId" integer NOT NULL, "customerId" integer NOT NULL, CONSTRAINT "PK_afc0da3c48110e7b19301cf17e0" PRIMARY KEY ("userId", "customerId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_52e2c3de109cbd23d97b2491e3" ON "user_customers_customer" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_39cd28e0031884e624a88fdaab" ON "user_customers_customer" ("customerId") `);
        await queryRunner.query(`ALTER TABLE "promotion" ADD CONSTRAINT "FK_2e7a151d1ec84a16d7a00cda728" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_customers_customer" ADD CONSTRAINT "FK_52e2c3de109cbd23d97b2491e3e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_customers_customer" ADD CONSTRAINT "FK_39cd28e0031884e624a88fdaaba" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_customers_customer" DROP CONSTRAINT "FK_39cd28e0031884e624a88fdaaba"`);
        await queryRunner.query(`ALTER TABLE "user_customers_customer" DROP CONSTRAINT "FK_52e2c3de109cbd23d97b2491e3e"`);
        await queryRunner.query(`ALTER TABLE "promotion" DROP CONSTRAINT "FK_2e7a151d1ec84a16d7a00cda728"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_39cd28e0031884e624a88fdaab"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_52e2c3de109cbd23d97b2491e3"`);
        await queryRunner.query(`DROP TABLE "user_customers_customer"`);
        await queryRunner.query(`DROP TABLE "customer"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "promotion"`);
    }

}
