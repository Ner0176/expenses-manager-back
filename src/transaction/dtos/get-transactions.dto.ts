import { IsNumber, IsOptional } from 'class-validator';
import { Category } from 'src/category';

export class GetTransactionsDto {
  @IsNumber()
  @IsOptional()
  categoryId?: number;
}

export class TransactionDto {
  total: number;
  transactions: {
    date: Date;
    title: string;
    amount: number;
    category: Category;
    description: string;
  }[];
}
