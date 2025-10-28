import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, RequestMethod } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());

  // CORS – deine Web-URL
  app.enableCors({
    origin: ['https://finarix-web.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    credentials: false,
    maxAge: 86400,
  });

  // * Alle API-Routen unter /api, /health bleibt frei *
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  // Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = Number(process.env.PORT) || 4000;
  await app.listen(port, '0.0.0.0');

  console.log(`Finarix API läuft auf Port ${port}`);
}

bootstrap();
