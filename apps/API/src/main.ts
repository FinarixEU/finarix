import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, RequestMethod } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

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

  // Alle API-Routen unter /api, aber /health ohne Prefix
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  // Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // >>> WICHTIG: Health-Check direkt auf dem Express-Server registrieren
  const expressApp = app.getHttpAdapter().getInstance(); // Express-Instanz holen
  expressApp.get('/health', (_req: any, res: any) => {
    res.json({ status: 'ok', message: 'Finarix API is running 🚀' });
  });
  // <<<

  const port = Number(process.env.PORT) || 4000;
  await app.listen(port, '0.0.0.0');

  // eslint-disable-next-line no-console
  console.log(`Finarix API läuft auf Port ${port}`);
}

bootstrap();
