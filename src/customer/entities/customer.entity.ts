import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('customers')
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    full_name: string;
    @Column()
    phone: string;
    @Column({ default: true })
    isActive: boolean;
    @ManyToOne(() => User, (user) => user.customers, { onDelete: 'SET NULL' })
    store: User;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
}