import { Category } from 'src/category';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional } from 'class-validator';

export class GetTransactionsDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  categoryId?: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;
}

export class TransactionDto {
  total: number;
  transactions: {
    id: number;
    date: Date;
    title: string;
    amount: number;
    category: Category;
    description: string;
  }[];
}
