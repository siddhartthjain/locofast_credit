import { env } from '@libs/core';
import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: env('REDIS_HOST', 'localhost'),
  port: env('REDIS_PORT', 6379),
  db: env('REDIS_DB', 0),
  keyPrefix: env('REDIS_PREFIX'),
}));
