import { Promotion } from "src/promotion/entities/promotion.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { Exclude } from "class-transformer";
import { Customer } from "src/customer/entities/customer.entity";

export enum UserRole {
    ADMIN='ADMIN',
    SALESMAN='SALESMAN',
    STORE='STORE',
    ALL='ALL'
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
    @Column({ default: 'public/avatar.png',transformer: {
        from: img => `${process.env.HOST}/${img}`,
        to: img => img
    }})
    avatar: string;
    @Column({
        type: 'enum',
        enum: Language,
        default: Language.ENGLISH
    })
    language: string;
    @Column({
        type: 'enum',
        enum: UserRole
    })
    role: string;
    @Column({ nullable: true })
    phone: string;
    @Column({ nullable: true })
    address: string;
    @Column({ nullable: true })
    @Exclude()
    token: string;
    @Column({ default: false })
    isActive: boolean;
    @Column({ default: 0 })
    count: number;
    @Column({ nullable: true })
    number_twilio: string;
    @Column({ nullable: true })
    number_sid: string;
    @Column({ nullable: true })
    service_name: string;
    @Column({ nullable: true })
    service_sid: string;
    @Column({ nullable: true })
    notify_name: string;
    @Column({ nullable: true })
    notify_sid: string;
    @OneToMany(() => Promotion, (promotion) => promotion.user, { onDelete: 'SET NULL' })
    promotions?: Promotion[];
    @OneToMany(() => Customer, (customer) => customer.store, { onDelete: 'SET NULL' })
    customers?: Customer[];
    @OneToMany(() => User, (store) => store.salesman, { onDelete: 'SET NULL'})
    stores?: User[];
    @ManyToOne(() => User, (salesman) => salesman.stores, { onDelete: 'SET NULL'})
    salesman?: User;
    
    
    
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