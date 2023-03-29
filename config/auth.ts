import { env } from '@libs/core';
import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  secret: env('JWT_SECRET')
}));
