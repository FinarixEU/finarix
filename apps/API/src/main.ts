import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, RequestMethod } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());

  // Dynamisches CORS (über Environment Variable)
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['https://finarix-web.onrender.com'];

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    credentials: true,
    maxAge: 86400,
  });

  // Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Health Route (funktioniert auch ohne Controller)
  const adapter = app.getHttpAdapter();
  adapter.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Finarix API läuft' });
  });
  console.log('[BOOT] /health route registered');

  // Start Server
  const port = Number(process.env.PORT) || 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`Finarix API läuft auf Port ${port}`);
}

bootstrap();
