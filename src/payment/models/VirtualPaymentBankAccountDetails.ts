import { BaseModel } from '@libs/core';
import { Modifiers, AnyQueryBuilder } from 'objection';

export class VirtualPaymentBankAccountDetails extends BaseModel {
  static tableName = 'virtual_payment_bank_account_details';

  static modifiers: Modifiers<AnyQueryBuilder> = {
    defaultSelects(query) {
      query.select(
        'bank_account_id',
        'account_number',
        'bank_name',
        'ifsc',
        'name',
      );
    },
  };
}
