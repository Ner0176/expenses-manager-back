import { Category } from '../category/category.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column('float')
  amount: number;

  @Column()
  currency: string;

  @Column({ nullable: true })
  conversionRate: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Category, (category) => category.transactions)
  category: Category;
}
