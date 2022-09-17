import { Promotion } from "src/promotion/entities/promotion.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Exclude } from "class-transformer";

export enum UserRole {
    ADMIN='ADMIN',
    MODERATOR='MODERATOR',
    MANAGER='MANAGER',
    CUSTOMER='CUSTOMER'
}


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
    @Column({ default: '/user_default.png'})
    avatar: string;
    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CUSTOMER
    })
    role: string;
    @Column({ nullable: true })
    phone: string;
    @Column({ nullable: true })
    address: string;

    @OneToMany(() => Promotion, (promotion) => promotion.user)
    promotions?: Promotion[];
    @ManyToMany(() => User)
    @JoinTable()
    customers?: User[];
    
    
    
    @CreateDateColumn()
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
