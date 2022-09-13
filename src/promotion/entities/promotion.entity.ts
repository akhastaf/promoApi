import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Promotion {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    title: string;
    @Column({ type: 'text' , nullable: true })
    description: string;
    @Column({ default: '/promo_default.png' })
    image: string;

    @ManyToOne(() => User, (user) => user.promotions, { onDelete: 'CASCADE'})
    user: User;

    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
}
