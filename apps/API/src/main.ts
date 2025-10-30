import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, RequestMethod } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet({ crossOriginResourcePolicy: false }));

  // Globaler Prefix /api (Health frei)
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  // Erlaubte Origins aus ENV (Komma-getrennt)
  const allowedOrigins = (process.env.ALLOWED_ORIGINS ||
    'https://finarix-web.onrender.com')
    .split(',')
    .map((s) => s.trim());

  // Express-CORS (einfacher Modus)
  app.enableCors({
    origin: allowedOrigins,        // Array wird direkt unterstützt
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    maxAge: 86400,
  });

  // Zusätzliche Middleware -> fängt wirklich JEDES OPTIONS ab (Fallback)
  app.use((req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin as string | undefined;

    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Accept, Authorization',
    );

    if (req.method === 'OPTIONS') {
      // Preflight hier beenden
      return res.sendStatus(204);
    }
    next();
  });

  // Health (ohne /api)
  app.getHttpAdapter().get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Finarix API läuft' });
  });

  // Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = Number(process.env.PORT) || 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`Finarix API läuft auf Port ${port}`);
}
bootstrap();
