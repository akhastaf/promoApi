import { UserRole } from 'src/user/entities/user.entity';

export const Admin = {
    name: 'admin',//process.env.ADMIN_NAME,
    email: 'admin@benguerir.tech',//process.env.ADMIN_EMAIL,
    password: 'admin',//process.env.ADMIN_PASSWORD
    role: UserRole.ADMIN,
    isActive: true,
};
