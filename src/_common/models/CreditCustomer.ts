import { BaseModel } from "@libs/core/db";


export class CreditCustomer extends BaseModel {
  static tableName = 'credit_customer';

  static relationMappings = {
    fabricOrders: {
      relation: BaseModel.HasManyRelation,
      modelClass: 'fabric_order',
      
      join: {
        from: 'credit_customer.id',
        to: 'fabric_order.credit_customer_id',
      },
    }
  }

}
