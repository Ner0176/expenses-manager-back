import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CurrencyService } from './currency.service';

@Module({
  imports: [HttpModule],
  exports: [CurrencyService],
  providers: [CurrencyService],
})
export class CurrencyModule {}
