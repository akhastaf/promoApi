import { UserRole } from 'src/user/entities/user.entity';

export const Admin = {
    name: 'admin',//process.env.ADMIN_NAME,
    email: 'eddie@txthem.com',//process.env.ADMIN_EMAIL,
    password: 'admin',//process.env.ADMIN_PASSWORD
    role: UserRole.ADMIN,
    isActive: true,
};
