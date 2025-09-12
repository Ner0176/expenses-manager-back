import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';
import { CategoryModule } from 'src/category';
import { CurrencyModule } from 'src/currency';

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
