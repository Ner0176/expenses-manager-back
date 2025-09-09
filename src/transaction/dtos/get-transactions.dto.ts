import { IsNumber, IsOptional } from 'class-validator';

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
    category: string;
    description: string;
  }[];
}
