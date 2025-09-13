import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';
import { CategoryModule } from '../category/category.module';
import { CurrencyModule } from '../currency/currency.module';
import { TransactionController } from './transaction.controller';

@Module({
  providers: [TransactionService],
  controllers: [TransactionController],
  imports: [
    CategoryModule,
    CurrencyModule,
    TypeOrmModule.forFeature([Transaction]),
  ],
})
export class TransactionModule {}
