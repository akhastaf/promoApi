import { User } from "src/user/entities/user.entity";
import { MigrationInterface, QueryRunner } from "typeorm"
import { Admin } from "./seeds/Admin";

export class CreateAmdinUser1663103299427 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.insert<User>('user', await Admin());
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.clearTable('user');
    }

}
