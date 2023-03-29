import { BaseModel } from '@libs/core';
import {
  AnyQueryBuilder,
  Modifiers,
  RelationMappings,
  RelationMappingsThunk,
} from 'objection';
import { VirtualPaymentAccountUpiDetails } from './VirtualPaymentAccountUpiDetails';
import { VirtualPaymentBankAccountDetails } from './VirtualPaymentBankAccountDetails';

export class VirtualPaymentAccountDetails extends BaseModel {
  static tableName = 'virtual_payment_account_details';

  static modifiers: Modifiers<AnyQueryBuilder> = {
    defaultSelects(query) {
      query.select('id', 'razorpay_customer_id', 'virtual_payment_account_id');
    },
  };

  static relationMappings: RelationMappings | RelationMappingsThunk = {
    bankAccountDetails: {
      relation: BaseModel.HasOneRelation,
      modelClass: VirtualPaymentBankAccountDetails,
      join: {
        from: 'virtual_payment_account_details.id',
        to: 'virtual_payment_bank_account_details.vpa_details_id',
      },
      filter: {
        isDeleted: 0,
      },
    },

    upiDetails: {
      relation: BaseModel.HasOneRelation,
      modelClass: VirtualPaymentAccountUpiDetails,
      join: {
        from: 'virtual_payment_account_details.id',
        to: 'virtual_payment_account_upi_details.vpa_details_id',
      },
      filter: {
        isDeleted: 0,
      },
    },
  };
}
