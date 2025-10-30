import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, RequestMethod } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1) Security
  app.use(
    helmet({
      // Sonst blockiert Helmet gelegentlich Cross-Origin-Responses
      crossOriginResourcePolicy: false,
    }),
  );

  // 2) Globaler Prefix /api (Health bleibt frei)
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  // 3) CORS dynamisch über ENV (Fallback ist deine Web-URL)
  const allowedOrigins = (process.env.ALLOWED_ORIGINS ||
    'https://finarix-web.onrender.com')
    .split(',')
    .map((s) => s.trim());

  app.enableCors({
    origin: (origin, cb) => {
      // Ohne Origin (z. B. curl/Postman) erlauben
      if (!origin) return cb(null, true);
      cb(null, allowedOrigins.includes(origin));
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
    maxAge: 86400,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // 4) Manuelle Preflight-Antwort (zusätzlicher Fallback)
  const adapter = app.getHttpAdapter();
  adapter.options('*', (req: Request, res: Response) => {
    const reqOrigin = req.headers.origin as string | undefined;
    if (reqOrigin && allowedOrigins.includes(reqOrigin)) {
      res.setHeader('Access-Control-Allow-Origin', reqOrigin);
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
    res.status(204).send();
  });

  // 5) Health (ohne /api)
  adapter.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Finarix API läuft' });
  });
  console.log('[BOOT] /health route registered');

  // 6) Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // 7) Start
  const port = Number(process.env.PORT) || 4000;
  await app.listen(port, '0.0.0.0');
  console.log(Finarix API läuft auf Port ${port});
}

bootstrap();
