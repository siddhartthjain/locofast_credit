import { VirtualPaymentAccountDetails } from '@app/payment';
import { BaseModel } from '@libs/core';
import { User } from './User';
import { UserOrg } from './UserOrg';

export class Locofastroot extends BaseModel {
  static tableName = 'locofastroot';

  static modifiers = {
    defaultSelects(query) {
      query.select('locofastroot.id', 'locofastroot.name');
    },
    selectEmail(query) {
      query.select('email');
    },
    selectGSTDetails(query) {
      query.select('locofastroot.gstNumber', 'locofastroot.gstCertificate');
    },
  };

  static relationMappings = {
    primaryAddress: {
      relation: BaseModel.HasManyRelation,
      modelClass: 'BrandAddress',
      filter: (builder) =>
        builder.where({
          'brand_address.is_deleted': 0,
          'brand_address.address_type': 1,
        }),
      join: {
        from: 'locofastroot.id',
        to: 'brand_address.brand_id',
      },
    },

    organizationUsers: {
      relation: BaseModel.HasManyRelation,
      modelClass: User,
      join: {
        from: 'locofastroot.id',
        to: 'users.brand',
      },
      filter: {
        is_enabled: 1,
      },
    },

    razorpayDetails: {
      relation: BaseModel.HasOneThroughRelation,
      modelClass: VirtualPaymentAccountDetails,
      join: {
        from: 'locofastroot.id',
        through: {
          from: 'org_razorpay_customers.locofastroot_id',
          to: 'org_razorpay_customers.razorpay_customer_id',
        },
        to: 'virtual_payment_account_details.razorpay_customer_id',
      },
    },

    userManagerMapping: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: UserOrg,
      join: {
        from: 'locofastroot.id',
        to: 'user_org.locofastroot_id',
      },
      filter: { isDeleted: 0 },
    },
  };
}
