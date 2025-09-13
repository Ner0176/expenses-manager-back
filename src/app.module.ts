import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModule } from './transaction';
import { CategoryModule } from './category';
import { CurrencyModule } from './currency';
import { AppDataSource } from './data-source';

@Module({
  providers: [AppService],
  controllers: [AppController],
  imports: [
    CategoryModule,
    CurrencyModule,
    TransactionModule,
    TypeOrmModule.forRoot(AppDataSource.options),
  ],
})
export class AppModule {}
