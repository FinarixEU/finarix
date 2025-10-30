import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  // initial cors: false -> wir konfigurieren selbst
  const app = await NestFactory.create(AppModule, { cors: false });

  // 1) ALLOWED ORIGINS aus ENV (Render)
  const ALLOWED_ORIGINS = (process.env.CORS_ALLOWED_ORIGINS ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  // 2) CORS aktivieren (VOR Prefix/Helmet)
  app.enableCors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // z. B. curl/health
      if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      console.log('[CORS] blocked:', origin);
      return cb(null, false);
    },
    credentials: true, // <- wichtig
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    maxAge: 86400,
    optionsSuccessStatus: 204,
  });

  // 3) Optional: Sicherheits-Header
  app.use(helmet({ }));

  // 4) Globales Prefix /api (Health bleibt ohne Prefix)
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  // 5) Health-Route (ohne Prefix)
  const adapter = app.getHttpAdapter();
  adapter.get('/health', (_req, res) => {
    res.json({ status: 'ok', message: 'Finarix API läuft' });
  });

  // 6) Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = Number(process.env.PORT) || 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`Finarix API läuft auf Port ${port}`);
}
bootstrap();
