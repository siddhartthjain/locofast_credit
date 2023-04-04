import { BaseModel } from '@libs/core/db';

export class InvoicingRoot extends BaseModel {
  static tableName = 'invoicing_root';

  static modifiers = {
    suplierDetails(query) {
      query.select('name as supplierName');
      query.select('id as supplierId');
    },
  };

  static relationMappings = {
    fabricOrders: {
      relation: BaseModel.HasManyRelation,
      modelClass: 'fabric_order',

      join: {
        from: 'credit_customer.id',
        to: 'fabric_order.credit_customer_id',
      },
    },
  };
}
