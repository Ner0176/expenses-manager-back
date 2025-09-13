/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CurrencyService {
  private readonly API_URL = `https://openexchangerates.org/api/latest.json?app_id=${process.env.EXCHANGE_API_ID}`;

  constructor(private readonly httpService: HttpService) {}

  async convertCurrency({
    to,
    from,
    amount,
  }: {
    to: string;
    from: string;
    amount: number;
  }): Promise<{ rate: number; amount: number }> {
    try {
      const { data } = await firstValueFrom(this.httpService.get(this.API_URL));

      const rates = data.rates;

      if (!rates[from] || !rates[to]) {
        throw new HttpException(
          `Moneda no soportada: ${from} o ${to}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const amountInUSD = amount / rates[from];
      const convertedAmount = amountInUSD * rates[to];

      return {
        rate: rates[to] / rates[from],
        amount: Number(convertedAmount.toFixed(2)),
      };
    } catch (e) {
      throw new HttpException(
        `Error al convertir de ${from} a ${to}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
