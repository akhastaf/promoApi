import { UserRole } from "src/user/entities/user.entity";

export const Users = [
    {
        name: 'manager1',//process.env.ADMIN_FIRST_NAME,
        email: 'manager1@manager.com',//process.env.ADMIN_EMAIL,
        password: 'manager',//process.env.ADMIN_PASSWORD
        role: UserRole.MANAGER,
        isActive: true,
    },
    {
        name: 'manager2',//process.env.ADMIN_FIRST_NAME,
        email: 'manager2@manager.com',//process.env.ADMIN_EMAIL,
        password: 'manager',//process.env.ADMIN_PASSWORD
        role: UserRole.MANAGER,
        isActive: true,
    },
    {
        name: 'manager3',//process.env.ADMIN_FIRST_NAME,
        email: 'manager3@manager.com',//process.env.ADMIN_EMAIL,
        password: 'manager',//process.env.ADMIN_PASSWORD
        role: UserRole.MANAGER,
        isActive: false,
    },
    {
        name: 'modeartor1',//process.env.ADMIN_FIRST_NAME,
        email: 'modeartor1@modeartor.com',//process.env.ADMIN_EMAIL,
        password: 'modeartor',//process.env.ADMIN_PASSWORD
        role: UserRole.MODERATOR,
        isActive: true,
    },
    {
        name: 'moderator2',//process.env.ADMIN_FIRST_NAME,
        email: 'moderator2@moderator.com',//process.env.ADMIN_EMAIL,
        password: 'moderator',//process.env.ADMIN_PASSWORD
        role: UserRole.MODERATOR,
    },
]