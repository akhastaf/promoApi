import { UserRole } from "src/user/entities/user.entity";

export const Users = [
    {
        name: 'store1',//process.env.ADMIN_FIRST_NAME,
        email: 'store1@store.com',//process.env.ADMIN_EMAIL,
        password: 'store',//process.env.ADMIN_PASSWORD
        role: UserRole.STORE,
        isActive: true,
    },
    {
        name: 'store2',//process.env.ADMIN_FIRST_NAME,
        email: 'store2@store.com',//process.env.ADMIN_EMAIL,
        password: 'store',//process.env.ADMIN_PASSWORD
        role: UserRole.STORE,
        isActive: true,
    },
    {
        name: 'store3',//process.env.ADMIN_FIRST_NAME,
        email: 'store3@store.com',//process.env.ADMIN_EMAIL,
        password: 'store',//process.env.ADMIN_PASSWORD
        role: UserRole.STORE,
        isActive: false,
    },
    {
        name: 'salesman1',//process.env.ADMIN_FIRST_NAME,
        email: 'salesman1@salesman.com',//process.env.ADMIN_EMAIL,
        password: 'salesman',//process.env.ADMIN_PASSWORD
        role: UserRole.SALESMAN,
    },
    {
        name: 'salesman2',//process.env.ADMIN_FIRST_NAME,
        email: 'salesman2@salesman.com',//process.env.ADMIN_EMAIL,
        password: 'salesman',//process.env.ADMIN_PASSWORD
        role: UserRole.SALESMAN,
    },
]

