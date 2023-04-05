import { BaseModel } from '@libs/core';

export class Units extends BaseModel {
  static tableName = 'units';
  static modifiers = {
    unitsDetails(query) {
      query.select('id as unitId', 'unit', 'short_name');
    },
  };
}
