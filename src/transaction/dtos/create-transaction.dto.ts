import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsNumber()
  categoryId: number;
}
