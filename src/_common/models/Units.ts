import { BaseModel } from '@libs/core';

export class Units extends BaseModel {
  static tableName = 'units';
  static modifiers = {
    defaultSelects(query) {
      query.select('id', 'unit', 'short_name');
    },
  };
}
