import { BaseModel } from '@libs/core';
import { User } from './User';

export class UserManager extends BaseModel {
  static tableName = 'user_manager';

  static modifiers = {
    defaultSelects(query) {
      query.select('id', 'user_id', 'manager_id');
    },
  };

  static relationMappings = {
    userDetails: {
      relation: BaseModel.HasManyRelation,
      modelClass: User,
      join: {
        from: 'user_manager.user_id',
        to: 'users.id',
      },
      filter: {
        status: 'Y',
      },
    },

    managerDetails: {
      relation: BaseModel.HasOneRelation,
      modelClass: User,
      join: {
        from: 'user_manager.manager_id',
        to: 'users.id',
      },
      filter: {
        status: 'Y',
      },
    },
  };
}
