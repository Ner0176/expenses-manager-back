import { Transaction } from '../transaction/transaction.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tag: string;

  @Column()
  icon: string;

  @Column({ default: false })
  isDefault: boolean;

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions: Transaction[];
}
