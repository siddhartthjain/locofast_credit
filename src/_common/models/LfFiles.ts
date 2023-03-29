import { BaseModel } from '@libs/core';

export class LfFiles extends BaseModel {
  static tableName = 'lf_files';

  static relationMappings = {
    creator: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'User',
      join: {
        from: 'lf_files.created_by',
        to: 'users.id',
      },
    },
  };
}
