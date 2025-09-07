import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';
import { CategoryModule } from 'src/category';

@Module({
  providers: [TransactionService],
  controllers: [TransactionController],
  imports: [CategoryModule, TypeOrmModule.forFeature([Transaction])],
})
export class TransactionModule {}
