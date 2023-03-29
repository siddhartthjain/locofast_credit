import { Locofastroot, UserOrg } from '@app/_common';
import { BaseModel } from '@libs/core';
import { Model } from 'objection';

export class OrgRazorpayCustomers extends BaseModel {
  static tableName = 'org_razorpay_customers';

  static get relationMappings() {
    return {
      customer: {
        relation: Model.BelongsToOneRelation,
        modelClass: Locofastroot,
        join: {
          from: 'org_razorpay_customers.locofastroot_id',
          to: 'locofastroot.id',
        },
        filter: {
          status: 'Y',
        },
      },
      accountManager: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserOrg,
        join: {
          from: 'org_razorpay_customers.locofastroot_id',
          to: 'user_org.locofastroot_id',
        },
        filter: {
          isDeleted: 0,
        },
      },
    };
  }
}
