import * as bcrypt from 'bcrypt';
// import { User } from "src/user/entities/user.entity";
// import dotenv from 'dotenv';

// dotenv.config({ path: __dirname+'/../../../.env' });

// // import * as dotenv from "dotenv";
// // dotenv.config({ path: __dirname+'/../../../.env' });

export const Admin = async () => ({
    first_name: 'admin',//process.env.ADMIN_FIRST_NAME,
    last_name: 'admin',//process.env.ADMIN_LAST_NAME,
    email: 'abderrazzaqkhastaf@gmail.com',//process.env.ADMIN_EMAIL,
    password: await bcrypt.hash('admin123456', 10),//process.env.ADMIN_PASSWORD
    isAdmin: true,
});


export const Path = __dirname+'/../../../.env';