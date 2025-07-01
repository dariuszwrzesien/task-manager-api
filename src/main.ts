import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS for all routes not good for production
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

  const port = app
    .get<ConfigService>(ConfigService)
    .get<number>('APP_PORT', 3000);
  await app.listen(port);

  logger.log(`Application is running on port: ${port}`);
}
bootstrap();
