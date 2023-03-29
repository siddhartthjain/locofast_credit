import { BaseModel } from '@libs/core';

export class FabricOrderPaymentDetails extends BaseModel {
  static tableName = 'fabric_order_payment_details';

  static modifiers = {
    defaultSelects(query) {
      query.select(
        'order_id',
        'fabric_id',
        'amountExpected',
        'amountReceived',
        'paymentMode',
        'referenceNumber',
        'receivedAt',
      );
    },
  };
}
