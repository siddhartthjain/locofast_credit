import { Injectable, Inject } from '@nestjs/common';
import { UserContract } from '../repositories';
import { USER_REPOSITORY } from '../constants';

@Injectable()
export class UserService {
  constructor(@Inject(USER_REPOSITORY) private users: UserContract) {}

  async findById(id: number): Promise<Record<string, any>> {
    return this.users.firstWhere({ id });
  }
}
