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

export enum Language {
    ENGLISH='en',
    FRENCH='fr',
}


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column({ unique: true })
    email: string;
    @Column()
    @Exclude()
    password: string;
    @Column({ default: '/user_default.png'})
    avatar: string;
    @Column({
        type: 'enum',
        enum: Language,
        default: Language.ENGLISH
    })
    language: string;
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
    @Column({ nullable: true })
    @Exclude()
    token: string;
    @OneToMany(() => Promotion, (promotion) => promotion.user, { onDelete: 'SET NULL' })
    promotions?: Promotion[];
    @ManyToMany(() => User, (customer) => customer.managers, { onDelete: 'SET NULL' })
    customers?: User[];
    @ManyToMany(() => User, (manager) => manager.customers, { onDelete: 'SET NULL' } )
    @JoinTable()
    managers?: User[];
    
    
    
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
