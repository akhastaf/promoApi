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
    @Column({ default: 'default.png', transformer: {
        from: img => `${process.env.CLIENT_HOST}/${img}`,
        to: img => img
    }})
    image: string;

    @ManyToOne(() => User, (user) => user.promotions, { onDelete: 'CASCADE'})
    user: User;

    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;


    
}
