import { User } from "src/user/entities/user.entity";
import { MigrationInterface, QueryRunner } from "typeorm"
import { Admin } from "./seeds/Admin";

export class SeedForUser1667319802868 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const admin = queryRunner.manager.getRepository(User).create(Admin);
        await queryRunner.manager.getRepository(User).save(admin);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //await queryRunner.manager.getRepository(User).clear();
    }

}
