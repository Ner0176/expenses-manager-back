import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dtos';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get('')
  async findAll() {
    return await this.transactionService.findAll();
  }

  @Post('')
  async create(@Body() payload: CreateTransactionDto) {
    await this.transactionService.create(payload);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.transactionService.delete(id);
  }
}
