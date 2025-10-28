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

  // CORS
  app.enableCors({
    origin: ['https://finarix-web.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    credentials: false,
    maxAge: 86400,
  });

  // Alle echten API-Routen unter /api; /health bleibt frei
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  // Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // ---- RAW /health ohne Prefix (unabhängig von Controllern) ----
  const adapter = app.getHttpAdapter();
  // Variante 1: direkt über Adapter (Nest unterstützt das)
  // @ts-ignore - manche Typings kennen .get nicht, es funktioniert aber zur Laufzeit
  adapter.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Finarix API is running' });
  });
  console.log('[BOOT] /health route registered');

  const port = Number(process.env.PORT) || 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`Finarix API läuft auf Port ${port}`);
}
bootstrap();
