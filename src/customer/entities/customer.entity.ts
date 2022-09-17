/* import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    first_name: string;
    @Column({ nullable: true })
    middle_name: string;
    @Column()
    last_name: string;
    @Column({ nullable: true })
    email: string;
    @Column()
    phone: string;
    @Column({ default: '/customer_default.png'})
    avatar: string;

    @ManyToMany(() => User, (user) => user.customers)
    users: User[];

    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
}
 */