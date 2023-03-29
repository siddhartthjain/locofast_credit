import { env } from '@libs/core';
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: env('APP_NAME', 'Locofast'),
  env: env('APP_ENV', 'local'),
  debug: env('APP_DEBUG', 1),
  url: env('APP_URL', 'localhost'),
  port: env('APP_PORT', 5000),
}));