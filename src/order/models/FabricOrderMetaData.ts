import { BaseModel } from '@libs/core';

export class FabricOrderMetaData extends BaseModel {
  static tableName = 'fabric_order_meta_data';
  static modifiers = {
    paymentDetails(query) {
      query.select('payable_amount as amount');
      query.select('credit_period');
      query.select('credit_charges');
    },
  };
}
