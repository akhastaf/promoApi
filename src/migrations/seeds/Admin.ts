import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/user/entities/user.entity';
// import { User } from "src/user/entities/user.entity";
// import dotenv from 'dotenv';

// dotenv.config({ path: __dirname+'/../../../.env' });

// // import * as dotenv from "dotenv";
// // dotenv.config({ path: __dirname+'/../../../.env' });

export const Admin = {
    name: 'admin',//process.env.ADMIN_NAME,
    email: 'admin@admin.com',//process.env.ADMIN_EMAIL,
    password: 'admin',//process.env.ADMIN_PASSWORD
    role: UserRole.ADMIN,
};
