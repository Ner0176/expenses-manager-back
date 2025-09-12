import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModule } from './transaction';
import { CategoryModule } from './category';
import { CurrencyModule } from './currency';

@Module({
  providers: [AppService],
  controllers: [AppController],
  imports: [
    CategoryModule,
    CurrencyModule,
    TransactionModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      synchronize: true,
      database: 'db.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
  ],
})
export class AppModule {}
