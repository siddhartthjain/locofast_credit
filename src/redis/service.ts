import { RedisException } from '@libs/core/exceptions/redisException';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { redisRetryStrategy } from './utils/retryStrategy';

@Injectable()
export class RedisService {
  private client: Redis;
  private keyPrefix: string;

  constructor(private readonly config: ConfigService) {
    const redisConfig = this.config.get('redis');
    this.keyPrefix = redisConfig.keyPrefix;
    this.client = new Redis({
      host: redisConfig.host,
      port: redisConfig.port,
      retryStrategy: redisRetryStrategy,
    });
  }

  // Basic redis methods, promisifed instead of using callbacks
  async get(key: string) {
    try {
      return await this.client.get(this.storeKey(key));
    } catch (Err) {
      throw new RedisException(Err);
    }
  }

  async set(key: string, value: string, ttlInSec?: number) {
    try {
      if (ttlInSec) {
        return await this.client.set(this.storeKey(key), value, 'EX', ttlInSec);
      }
      return await this.client.set(this.storeKey(key), value);
    } catch (Err) {
      throw new RedisException(Err);
    }
  }

  async hget(key: string, hash: string) {
    try {
      return await this.client.hget(this.storeKey(key), hash);
    } catch (Err) {
      throw new RedisException(Err);
    }
  }

  async hset(key: string, hash: string, value: string) {
    try {
      return await this.client.hset(this.storeKey(key), hash, value);
    } catch (Err) {
      throw new RedisException(Err);
    }
  }

  async hincrby(key: string, hash: string, incrementValue: number) {
    try {
      return await this.client.hincrby(
        this.storeKey(key),
        hash,
        incrementValue,
      );
    } catch (Err) {
      throw new RedisException(Err);
    }
  }

  async del(key: string) {
    try {
      return await this.client.del(this.storeKey(key));
    } catch (Err) {
      throw new RedisException(Err);
    }
  }

  async ttl(key: string) {
    try {
      return await this.client.ttl(this.storeKey(key));
    } catch (Err) {
      throw new RedisException(Err);
    }
  }

  async hgetall(key: string) {
    try {
      return await this.client.hgetall(this.storeKey(key));
    } catch (Err) {
      throw new RedisException(Err);
    }
  }

  async hvals(key: string) {
    try {
      return await this.client.hvals(this.storeKey(key));
    } catch (Err) {
      throw new RedisException(Err);
    }
  }

  async hmset(key: string, value: Record<string, any>) {
    try {
      return await this.client.hmset(this.storeKey(key), value);
    } catch (Err) {
      throw new RedisException(Err);
    }
  }

  async hlen(key: string) {
    try {
      return await this.client.hlen(this.storeKey(key));
    } catch (Err) {
      throw new RedisException(Err);
    }
  }

  private storeKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }
}
