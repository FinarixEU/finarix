import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, RequestMethod } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());

  // CORS (deine Web-URL ggf. anpassen)
  app.enableCors({
    origin: ['https://finarix-web.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    credentials: false,
    maxAge: 86400,
  });

  // Alle „echten“ API-Routen unter /api — Health ausnehmen
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  // Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = Number(process.env.PORT) || 4000;
  // ---- RAW /health Route (unabhängg von Nest-Controllern/Prefix) ----
  app.getHttpAdapter().get(`/health`, (req, res) => {
    re.json({ status: `ok`, message: `Finarix API is running` });
  });
  await app.listen(port, '0.0.0.0');

  // eslint-disable-next-line no-console
  console.log(`Finarix API läuft auf Port ${port}`);
}
bootstrap();
