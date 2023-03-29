import { BaseModel } from '@libs/core';

export class OrderPaymentDetails extends BaseModel {
  static tableName = 'order_payment_details';

  static modifiers = {
    defaultSelects(query) {
      query.select(
        'customer_id',
        'cheque_number',
        'cheque_amount',
        'cheque_due_date',
      );
    },
  };

  static get relationMappings() {
    const { Locofastroot } = require('../../_common');

    return {
      orgDetails: {
        relation: BaseModel.HasOneRelation,
        modelClass: Locofastroot,
        join: {
          from: 'order_payment_details.customer_id',
          to: 'locofastroot.id',
        },
      },
    };
  }
}
