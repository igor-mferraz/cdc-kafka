import { Address } from 'src/address/entities/address.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn() 
    id: number;

    @Column({ length: 100 }) 
    nome: string;

    @Column({ unique: true })
    email: string;

    @Column() 
    ref_id: number;

    @CreateDateColumn()
    data_criacao: Date;

    @OneToMany(() => Address, address => address.user)
    addresses: Address[];
}