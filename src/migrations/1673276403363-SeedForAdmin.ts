import { User } from "src/user/entities/user.entity";
import { MigrationInterface, QueryRunner } from "typeorm"
import { Admin } from "./seeds/Admin";

export class SeedForAdmin1673276403363 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const admin = queryRunner.manager.getRepository(User).create(Admin);
        await queryRunner.manager.getRepository(User).save(admin);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        try {
            const admin = await queryRunner.manager.getRepository(User).findOneOrFail({
                where: {
                    email: Admin.email
                }
            });
            await queryRunner.manager.getRepository(User).remove(admin);
        } catch (error) {
            console.log(error);   
        }
    }

}
