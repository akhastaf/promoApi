import { User } from "src/user/entities/user.entity";
import { MigrationInterface, QueryRunner } from "typeorm"
import { Admin } from "./seeds/Admin";
import { Users } from "./seeds/Users";

export class SeedsForUser1663622667346 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const admin = queryRunner.manager.getRepository(User).create(Admin);
        await queryRunner.manager.getRepository(User).save(admin);
      /*   const users = Users.map((item) => {
            queryRunner.manager.getRepository(User).create(item);
        }); */
        const users = queryRunner.manager.getRepository(User).create(Users);
        await queryRunner.manager.getRepository(User).save(users);
        console.log(users);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //await queryRunner.manager.getRepository(User).clear();
    }
}
