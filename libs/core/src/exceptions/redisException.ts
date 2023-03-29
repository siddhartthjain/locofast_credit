import { HttpException } from '@nestjs/common';

export class RedisException extends HttpException {
  constructor(message: string) {
    super(message, 500);
  }
}
