import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, RequestMethod } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- Security Middleware ---
  app.use(helmet());

  // --- CORS Einstellungen ---
  app.enableCors({
    origin: ['https://finarix-web.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    credentials: false,
    maxAge: 86400,
  });

  // --- Global Prefix für API ---
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  // --- Validation Pipes ---
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // --- Immer erreichbarer Health-Check ---
  app.getHttpAdapter().get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Finarix API is running 🚀' });
  });

  // --- Start Server ---
  const port = Number(process.env.PORT) || 4000;
  await app.listen(port, '0.0.0.0');

  // eslint-disable-next-line no-console
  console.log(`Finarix API läuft auf Port ${port}`);
}

bootstrap();
