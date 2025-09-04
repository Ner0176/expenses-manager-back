import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'development'
        ? process.env.FRONT_LOCAL_URL
        : process.env.FRONT_PROD_URL,
  });

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
