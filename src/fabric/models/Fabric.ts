import { BaseModel } from '@libs/core';

export class Fabric extends BaseModel {
  static tableName = 'fabrics';
  static modifiers = {
    fabricDetails(query) {
      query.select('fabric_name');
      query.select('fabric_specification');
      query.select('hsn_code');
      query.select('id as fabricId');
    },
  };
}
