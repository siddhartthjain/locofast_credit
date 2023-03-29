import { BaseModel } from '@libs/core';

export class Currency extends BaseModel {
  static tableName = 'currency';
  static modifiers = {
    defaultSelects(query) {
      query.select('id', 'code', 'symbol');
    },
  };
}
