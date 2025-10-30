import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, RequestMethod } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  // CORS selber konfigurieren → initial cors: false
  const app = await NestFactory.create(AppModule, { cors: false });

  // 1) CORS ZUERST aktivieren (vor Prefix/Helmet)
  const ALLOWED_ORIGINS = [
    'https://finarix-web.onrender.com',
    // optional lokal:
    'http://localhost:5500',
    'http://127.0.0.1:5500',
  ];

  app.enableCors({
    // erlaubt nur unsere Origins – gibt hilfreiche Logs aus
    origin: (origin, cb) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        cb(null, true);
      } else {
        console.log('[CORS] blocked origin:', origin);
        cb(null, false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: false,
    maxAge: 86400,
    optionsSuccessStatus: 204,
  });

  // 2) Sicherheits-Header
  app.use(helmet());

  // 3) Globales Prefix – /health bleibt frei
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  // 4) RAW /health (ohne Prefix)
  const adapter = app.getHttpAdapter();
  adapter.get('/health', (_req, res) => {
    res.json({ status: 'ok', message: 'Finarix API läuft' });
  });

  // 5) Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = Number(process.env.PORT) || 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`Finarix API läuft auf Port ${port}`);
}

bootstrap();
