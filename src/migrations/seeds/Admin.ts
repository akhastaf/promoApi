import { UserRole } from 'src/user/entities/user.entity';
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/../../../.env' });

export const Admin = {
    name: process.env.ADMIN_NAME,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    role: UserRole.ADMIN,
    isActive: true,
};