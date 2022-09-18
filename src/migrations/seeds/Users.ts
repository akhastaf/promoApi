import { UserRole } from "src/user/entities/user.entity";

export const Users = [
    {
        name: 'customer1',//process.env.ADMIN_FIRST_NAME,
        email: 'customer1@customer.com',//process.env.ADMIN_EMAIL,
        password: 'customer',//process.env.ADMIN_PASSWORD
        role: UserRole.CUSTOMER,
    },
    {
        name: 'customer2',//process.env.ADMIN_FIRST_NAME,
        email: 'customer2@customer.com',//process.env.ADMIN_EMAIL,
        password: 'customer',//process.env.ADMIN_PASSWORD
        role: UserRole.CUSTOMER,
    },
    {
        name: 'customer3',//process.env.ADMIN_FIRST_NAME,
        email: 'customer3@customer.com',//process.env.ADMIN_EMAIL,
        password: 'customer',//process.env.ADMIN_PASSWORD
    },
    {
        name: 'manager1',//process.env.ADMIN_FIRST_NAME,
        email: 'manager1@manager.com',//process.env.ADMIN_EMAIL,
        password: 'managaer',//process.env.ADMIN_PASSWORD
        role: UserRole.MANAGER,
    },
    {
        name: 'manager2',//process.env.ADMIN_FIRST_NAME,
        email: 'manager2@manager.com',//process.env.ADMIN_EMAIL,
        password: 'managaer',//process.env.ADMIN_PASSWORD
        role: UserRole.MANAGER,
    },
    {
        name: 'manager3',//process.env.ADMIN_FIRST_NAME,
        email: 'manager3@manager.com',//process.env.ADMIN_EMAIL,
        password: 'managaer',//process.env.ADMIN_PASSWORD
        role: UserRole.MANAGER,
    },
    {
        name: 'modeartor1',//process.env.ADMIN_FIRST_NAME,
        email: 'modeartor1@modeartor.com',//process.env.ADMIN_EMAIL,
        password: 'modeartor',//process.env.ADMIN_PASSWORD
        role: UserRole.MODERATOR,
    },
    {
        name: 'moderator2',//process.env.ADMIN_FIRST_NAME,
        email: 'moderator2@moderator.com',//process.env.ADMIN_EMAIL,
        password: 'moderator',//process.env.ADMIN_PASSWORD
        role: UserRole.MODERATOR,
    },
]