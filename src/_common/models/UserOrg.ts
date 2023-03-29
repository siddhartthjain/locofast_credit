import { BaseModel } from '@libs/core';
import { User } from './User';
import { UserManager } from './UserManager';

export class UserOrg extends BaseModel {
  static tableName = 'user_org';

  static modifiers = {
    selectUserId(query) {
      query.select('user_id');
    },
    filterOrg(query, supplierId) {
      query.where('locofastroot_id', supplierId);
    },
  };

  static relationMappings = {
    userDetails: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'user_org.user_id',
        to: 'users.id',
      },
      filter: {
        status: 'Y',
      },
    },
    userManagerMapping: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: UserManager,
      join: {
        from: 'user_org.user_id',
        to: 'user_manager.user_id',
      },
      filter: {
        isDeleted: 0,
      },
    },
  };
}
