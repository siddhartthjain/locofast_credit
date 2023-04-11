import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app';
import { useContainer } from 'class-validator';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ConfigService } from '@nestjs/config';
import { CommonModule, LfRootService } from './_common';
import { ExceptionFilter, RequestGuard } from '@libs/core';
import { RedisService } from './redis/service';
import { AuthGuard } from './auth';
import { InvoicingRootModule } from './Invoicing_root/module';
import { InvoicingRootService } from './Invoicing_root/service/InvoicingRootService';
import { InvoicingUserService } from './_common/services/InvoicingUserService';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // middlewares, express specific
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(helmet());
 
  const allowedOrigin = (process.env.APP_ALLOWED_ORIGIN || '')
  .split(',')
  .map(url => url.trim());

app.enableCors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  preflightContinue: false,
  optionsSuccessStatus: 204,
 // credentials: true,
});

  app.use(rateLimit({ windowMs: 60, max: 50 }));
  const invoicingRootService = app
    .select(InvoicingRootModule)
    .get(InvoicingRootService, { strict: true });

  const invoicingUserService = app
    .select(CommonModule)
    .get(InvoicingUserService, { strict: true });

  /* const userService = app
    .select(CommonModule)
    .get(UserService, { strict: true });*/

  // guards
  app.useGlobalGuards(
    new RequestGuard(),
    new AuthGuard(
      new RedisService(config),
      invoicingRootService,
      invoicingUserService,
      config,
    ),
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
