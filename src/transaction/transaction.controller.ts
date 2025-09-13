import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  CreateTransactionDto,
  EditTransactionDto,
  GetTransactionsDto,
} from './dtos';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get('')
  async findAll(@Query() payload: GetTransactionsDto) {
    return await this.transactionService.findAll(payload);
  }

  @Post('create')
  async create(@Body() payload: CreateTransactionDto) {
    await this.transactionService.create(payload);
  }

  @Patch('edit/:id')
  async edit(
    @Body() payload: EditTransactionDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.transactionService.edit(id, payload);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.transactionService.delete(id);
  }
}
