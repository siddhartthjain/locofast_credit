import { BaseModel } from '@libs/core';

export class User extends BaseModel {
  static tableName = 'users';
  static modifiers = {
    defaultSelects(query) {
      query.select('users.id', 'users.name');
    },
    selectEmail(query) {
      query.select('email');
    },
    selectPhone(query) {
      query.select('calling_code', 'phone');
    },
    selectRole(query) {
      query.select('role');
    },
  };

  static relationMappings = {
    organization: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'Locofastroot',
      join: {
        from: 'users.brand',
        to: 'locofastroot.id',
      },
    },

    managerMapping: {
      relation: BaseModel.HasOneThroughRelation,
      modelClass: User,
      join: {
        from: 'users.id',
        through: {
          from: 'UserManager.userId',
          to: 'UserManager.managerId',
        },
        to: 'users.id',
      },
      filter: (builder) => builder.where({ 'UserManager.isDeleted': 0 }),
    },
  };
}
