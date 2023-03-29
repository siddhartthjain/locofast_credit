import { env } from '@libs/core';
import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  type: env('DB_TYPE', 'mysql2'),
  host: env('DB_HOST', 'localhost'),
  port: env('DB_PORT', 3306),
  username: env('DB_USER', 'root'),
  password: env('DB_PASSWORD', 'root'),
  database: env('DB_DATABASE', 'test'),
}));
