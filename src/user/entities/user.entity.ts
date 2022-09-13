import { Promotion } from "src/promotion/entities/promotion.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Customer } from "src/customer/entities/customer.entity";
import { Exclude } from "class-transformer";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    first_name: string;
    @Column({ nullable: true })
    middle_name: string;
    @Column()
    last_name: string;
    @Column({ unique: true })
    email: string;
    @Column()
    @Exclude()
    password: string;
    @Column({ default: false})
    isAdmin: boolean;
    @Column({ default: '/user_default.png'})
    avatar: string;
    @CreateDateColumn()
    
    @OneToMany(() => Promotion, (promotion) => promotion.user)
    promotions?: Promotion[];
    @ManyToMany(() => Customer, (customer) => customer.users)
    @JoinTable()
    customers?: Customer[];
    
    
    createdAt: Date; 
    @UpdateDateColumn()
    updatedAt: Date;
    
    @BeforeInsert()
    async hashPassword() : Promise<void> {
        this.password = await bcrypt.hash(this.password, 10);
    }

    constructor(partial : Partial<User>) {
        Object.assign(this, partial);
    }
}
