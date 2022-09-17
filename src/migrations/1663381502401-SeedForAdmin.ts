import { User } from "src/user/entities/user.entity";
import { MigrationInterface, QueryRunner } from "typeorm"
import { Admin } from "./seeds/Admin";
import { Users } from "./seeds/Users";

export class SeedForAdmin1663381502401 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const admin = queryRunner.manager.getRepository(User).create(Admin);
        await queryRunner.manager.getRepository(User).save(admin);
        Users.forEach(async (u) => {
            let user = queryRunner.manager.getRepository(User).create(u);
            await queryRunner.manager.getRepository(User).save(user);
        })
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //await queryRunner.manager.getRepository(User).clear();
    }
}
