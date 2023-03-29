import { BaseModel } from '@libs/core';
import { Modifiers, AnyQueryBuilder } from 'objection';

export class VirtualPaymentAccountUpiDetails extends BaseModel {
  static tableName = 'virtual_payment_account_upi_details';

  static modifiers: Modifiers<AnyQueryBuilder> = {
    defaultSelects(query) {
      query.select(
        'address',
      );
    },
  };
}
