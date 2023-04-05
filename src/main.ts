import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app';
import { useContainer } from 'class-validator';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ConfigService } from '@nestjs/config';
import { CommonModule, LfRootService } from './_common';
import { ExceptionFilter, RequestGuard } from '@libs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // middlewares, express specific
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(helmet());
  app.use(rateLimit({ windowMs: 60, max: 50 }));
  const lfRootService = app
    .select(CommonModule)
    .get(LfRootService, { strict: true });

  /* const userService = app
    .select(CommonModule)
    .get(UserService, { strict: true });*/

  // guards
  app.useGlobalGuards(
    new RequestGuard(),
    // new AuthGuard(new RedisService(config), lfRootService, userService, config),
  );

  // filters
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ExceptionFilter(httpAdapter));

  // interceptors
  //  app.useGlobalInterceptors(new TimeoutInterceptor());

  // await app.listen(config.get('app.port'));
  await app.listen(3000);
}

bootstrap();
