import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import jwt = require('jsonwebtoken');

import { RedisService } from '@app/redis/service';

import { UserService, LfRootService } from '@app/_common';
import { ConfigService } from '@nestjs/config';
import { RedisException } from '@libs/core/exceptions/redisException';

@Injectable()
export class AuthGuard implements CanActivate {
  private keyPrefix: string;
  private secretKey: string;

  constructor(
    private readonly redisService: RedisService,
    private readonly lfRootService: LfRootService,
    private readonly userService: UserService,
    private readonly config: ConfigService,
  ) {
    this.keyPrefix = this.config.get('redis').keyPrefix;
    this.secretKey = this.config.get('auth').secret;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return true;
    const request = context.switchToHttp().getRequest();

    if (request.headers['data-access-key']) {
      if (
        request.headers['data-access-key'] ===
        process.env.DATA_PROVIDER_ACCESS_KEY
      ) {
        return true;
      }
      return false;
    }

    if (!request.headers['authorization']) {
      return false;
    }
    const bearer = request.headers['authorization'].split(' ')[1];
    const decodedToken = jwt.decode(bearer) as any;
    const userValid = await this.validateUser(decodedToken, bearer);

    if (userValid) {
      request.user = decodedToken;
    }
    return userValid;
  }

  async validateUser(
    decodedToken: Record<string, any>,
    bearer: string,
  ): Promise<boolean> {
    const { uid, oid, sessionId } = decodedToken;
    if (!decodedToken) return false;
    else {
      const [validUser, brandSecretKey, userSecretKey] =
        await this.verifySessionAndGetSecretKeys(uid, oid, sessionId);
      if (!validUser) return false;
      const combinedJwtSecret = `${userSecretKey}${brandSecretKey}${this.secretKey}`;
      try {
        const decodedToken = await jwt.verify(bearer, combinedJwtSecret);
        if (decodedToken) return true;
        return false;
      } catch (err) {
        return false;
      }
    }
  }

  async verifySessionAndGetSecretKeys(
    userId: number,
    orgId: number,
    sessionId: string,
  ) {
    let updateBrandSecretKeyCache = false;
    let updateUserSecretKeyCache = false;

    const validSession = await this.getUserIdFromSessionId(sessionId);
    if (validSession !== userId) return [false];

    const [brandSecretKey, updateBrandKey] = await this.getBrandSecretKey(
      orgId,
    );
    if (updateBrandKey) {
      updateBrandSecretKeyCache = true;
    }

    const [userSecretKey, updateUserKey] = await this.getUserSecretKey(userId);
    if (updateUserKey) {
      updateUserSecretKeyCache = true;
    }

    if (updateBrandSecretKeyCache) {
      await this.storeBrandSecretKey(orgId, brandSecretKey);
    }

    if (updateUserSecretKeyCache) {
      await this.storeUserSecretKey(userId, userSecretKey);
    }

    return [true, brandSecretKey, userSecretKey];
  }

  /**
   * Auth specific methods to fetch brand, user related data(Token Secret keys) from db and redis
   *
   */

  async getUserIdFromSessionId(sessionId: string) {
    try {
      const response = await this.redisService.get(`sess:${sessionId}`);
      return +response;
    } catch (Err) {
      throw new RedisException(Err);
    }
  }

  async getBrandSecretKey(brandId: number) {
    try {
      const response = await this.redisService.hget(
        `Brands-Secret-Keys`,
        brandId.toString(),
      );
      if (!response) {
        const orgData = await this.lfRootService.findById(brandId);
        if (orgData && orgData.secretKey) {
          return [orgData.secretKey, true];
        }
      }
      return [response, false];
    } catch (Err) {
      throw new RedisException(Err);
    }
  }

  async getUserSecretKey(userId: number) {
    try {
      const response = await this.redisService.hget(
        `Users-Secret-Keys`,
        userId.toString(),
      );
      if (!response) {
        const userData = await this.userService.findById(userId);

        if (userData && !userData.isEnabled) {
          return ['', false];
        }

        if (userData && userData.secretKey) {
          return [userData.secretKey, true];
        }
      }
      return [response, false];
    } catch (Err) {
      throw new RedisException(Err);
    }
  }

  async storeBrandSecretKey(brandId: number, brandSecretKey: string) {
    try {
      const response = await this.redisService.hset(
        `Brands-Secret-Keys`,
        brandId.toString(),
        brandSecretKey,
      );
      return response;
    } catch (Err) {
      throw new RedisException(Err);
    }
  }

  async storeUserSecretKey(userId: number, userSecretKey: string) {
    try {
      const response = await this.redisService.hset(
        `Users-Secret-Keys`,
        userId.toString(),
        userSecretKey,
      );
      return response;
    } catch (Err) {
      throw new RedisException(Err);
    }
  }
}
