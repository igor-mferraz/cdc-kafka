import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn() 
    id: number;

    @Column({ length: 100 }) 
    nome: string;

    @Column({ unique: true })
    email: string;

    @CreateDateColumn()
    data_criacao: Date;
}