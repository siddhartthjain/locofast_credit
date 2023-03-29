import { BaseModel } from "src/core/db";


export class CreditUser extends BaseModel {
  static tableName = 'credit_users';
  // static modifiers = {
  //   defaultSelects(query) {
  //     query.select('credit_users.id as userId', 'name', 'role');
  //   },
  //   selectEmail(query) {
  //     query.select('id', 'first_name', 'name', 'email', 'isEnabled');
  //   },
  //   selectPhone(query) {
  //     query.select('calling_code', 'phone');
  //   }
  // };

  static relationMappings = {
    organization: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'Locofastroot',
      join: {
        from: 'users.brand',
        to: 'locofastroot.id',
      },
    },
    manager: {
      relation: BaseModel.HasOneThroughRelation,
      modelClass: 'User',
      join: {
        from: 'users.id',
        through: {
          from: 'UserManager.userId',
          filter: (builder) => builder.where({ 'UserManager.isDeleted': 0}),
          to: 'UserManager.managerId',
        },
        to: 'users.id',
      },
    },
  };

  email: string;
  name: string;
}
