import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { Repository } from 'typeorm';
import {
  CreateTransactionDto,
  GetTransactionsDto,
  TransactionDto,
} from './dtos';
import { CategoryService } from 'src/category';
import { format } from 'date-fns';
import { CurrencyService } from 'src/currency';

@Injectable()
export class TransactionService {
  constructor(
    private categoryService: CategoryService,
    private currencyService: CurrencyService,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async findAll({ categoryId }: GetTransactionsDto) {
    const transactionsList = await this.transactionRepository.find({
      relations: ['category'],
      order: { date: 'DESC' },
      where: { category: { id: categoryId } },
    });

    let totalGeneral = 0;

    const grouped: Record<string, TransactionDto> = transactionsList.reduce(
      (acc, tx) => {
        const formattedDate = format(tx.date, 'dd/MM/yyyy');

        if (!acc[formattedDate]) {
          acc[formattedDate] = {
            total: 0,
            transactions: [],
          };
        }

        acc[formattedDate].transactions.push({
          id: tx.id,
          date: tx.date,
          title: tx.title,
          amount: tx.amount,
          category: tx.category,
          description: tx.description ?? '',
        });

        totalGeneral += tx.amount;
        acc[formattedDate].total += tx.amount;

        return acc;
      },
      {} as Record<string, TransactionDto>,
    );

    return {
      totalGeneral,
      list: Object.values(grouped),
    };
  }

  async create(payload: CreateTransactionDto) {
    const { amount, currency, categoryId } = payload;

    const category = await this.categoryService.findOne(categoryId);

    if (!category) {
      throw new NotFoundException(
        `Category with id: ${category} could not be found`,
      );
    }

    let convertedAmount = amount;
    let conversionRate: number | null;
    if (currency !== 'EUR') {
      const { rate, amount: newAmount } =
        await this.currencyService.convertCurrency({
          amount,
          to: 'EUR',
          from: currency,
        });
      conversionRate = rate;
      convertedAmount = newAmount;
    }

    const newTransaction = this.transactionRepository.create({
      ...payload,
      ...{
        category,
        conversionRate,
        date: new Date(),
        amount: convertedAmount,
      },
    });

    await this.transactionRepository.save(newTransaction);
  }

  async delete(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });
    await this.transactionRepository.remove(transaction);
  }
}
