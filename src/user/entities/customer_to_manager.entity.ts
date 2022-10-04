import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('customer_manager')
export class CustomerToManager {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    customerId: number;
    @Column()
    managerId: number;
    @ManyToOne(() => User, (customer) => customer.managers)
    customer: User;
    @ManyToOne(() => User, (manager) => manager.customers)
    manager: User;
    @CreateDateColumn()
    subcribeDate: Date;
}