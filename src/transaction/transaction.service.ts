import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import {
  TransactionDto,
  GetTransactionsDto,
  CreateTransactionDto,
  EditTransactionDto,
} from './dtos';
import { format } from 'date-fns';
import { CategoryService } from '../category/category.service';
import { CurrencyService } from '../currency/currency.service';

@Injectable()
export class TransactionService {
  constructor(
    private categoryService: CategoryService,
    private currencyService: CurrencyService,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async findAll({ categoryId, endDate, startDate }: GetTransactionsDto) {
    const where: any = {};

    if (categoryId) {
      where.category = { id: categoryId };
    }

    if (startDate && endDate) where.date = Between(startDate, endDate);
    else if (startDate) where.date = MoreThanOrEqual(startDate);
    else if (endDate) where.date = LessThanOrEqual(endDate);

    const transactionsList = await this.transactionRepository.find({
      where,
      relations: ['category'],
      order: { date: 'DESC' },
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
          currency: tx.currency,
          description: tx.description ?? '',
          conversionRate: tx.conversionRate ?? undefined,
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

  private async currencyConversion({
    amount,
    currency,
  }: {
    amount: number;
    currency: string;
  }) {
    let convertedAmount = amount;
    let conversionRate: number | null = null;
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

    return { conversionRate, convertedAmount };
  }

  async create(payload: CreateTransactionDto) {
    const { amount, currency, categoryId } = payload;

    const category = await this.categoryService.findOne(categoryId);

    if (!category) {
      throw new NotFoundException(
        `Category with id: ${category} could not be found`,
      );
    }

    const { conversionRate, convertedAmount } = await this.currencyConversion({
      amount,
      currency,
    });

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

  async edit(id: number, payload: EditTransactionDto) {
    const txDetails = await this.transactionRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!txDetails) {
      throw new NotFoundException(
        `Transaction with id: ${id} has not been found`,
      );
    }

    let newAmount = payload.amount ?? txDetails.amount;
    const newCurrency = payload.currency ?? txDetails.currency;
    let conversionRate: number | null = txDetails.conversionRate ?? null;

    if (!!payload.amount || !!payload.currency) {
      const { convertedAmount, conversionRate: newRate } =
        await this.currencyConversion({
          amount: newAmount,
          currency: newCurrency,
        });

      newAmount = convertedAmount;
      conversionRate = newRate;
    }

    let category = txDetails.category;
    if (payload.categoryId !== undefined) {
      const foundCategory = await this.categoryService.findOne(
        payload.categoryId,
      );
      if (!foundCategory) {
        throw new NotFoundException(
          `Category with id: ${payload.categoryId} could not be found`,
        );
      }
      category = foundCategory;
    }

    const updatedTx = this.transactionRepository.merge(txDetails, {
      ...payload,
      category,
      conversionRate,
      amount: newAmount,
      currency: newCurrency,
    });

    await this.transactionRepository.save(updatedTx);
    return updatedTx;
  }

  async delete(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });
    await this.transactionRepository.remove(transaction);
  }
}
