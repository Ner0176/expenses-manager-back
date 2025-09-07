import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dtos';
import { CategoryService } from 'src/category';

@Injectable()
export class TransactionService {
  constructor(
    private categoryService: CategoryService,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async findAll() {
    return await this.transactionRepository.find({ relations: ['category'] });
  }

  async create(payload: CreateTransactionDto) {
    const category = await this.categoryService.findOne(payload.categoryId);

    if (!category) {
      throw new NotFoundException(
        `Category with id: ${category} could not be found`,
      );
    }

    const newTransaction = this.transactionRepository.create({
      ...payload,
      ...category,
    });

    await this.transactionRepository.save(newTransaction);
  }

  async delete(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });
    await this.transactionRepository.delete(transaction);
  }
}
