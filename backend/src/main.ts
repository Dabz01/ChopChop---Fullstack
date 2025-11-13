import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: false,
  });

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 4000;

  await app.listen(port);
  console.log(`Backend running on http://localhost:${port}`);
}
bootstrap();
