import { User } from "src/user/entities/user.entity";
import { MigrationInterface, QueryRunner } from "typeorm"
import { Admin } from "./seeds/Admin";
import { Users } from "./seeds/Users";

export class SeedForUsers1665593594239 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const admin = queryRunner.manager.getRepository(User).create(Admin);
        await queryRunner.manager.getRepository(User).save(admin);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //await queryRunner.manager.getRepository(User).clear();
    }

}
