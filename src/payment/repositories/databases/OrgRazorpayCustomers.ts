import { Injectable } from '@nestjs/common';
import { OrgRazorpayCustomers } from '../../models';
import { DatabaseRepository, InjectModel } from '@libs/core';
import { OrgRazorpayCustomersContract } from '../contracts';
import { raw } from 'objection';

@Injectable()
export class OrgRazorpayCustomersRepository
  extends DatabaseRepository
  implements OrgRazorpayCustomersContract
{
  @InjectModel(OrgRazorpayCustomers)
  model: OrgRazorpayCustomers;

  async getOrgVpaDetails(orgId: number | string): Promise<Record<string, any>> {
    return this.query()
      .alias('orc')
      .select('orc.locofastroot_id')
      .select(
        raw(
          `  
        JSON_OBJECT(
          'name', vpbad.name,
          'ifsc', vpbad.ifsc,
          'bankName', vpbad.bank_name,
          'accountNumber', vpbad.account_number
          ) AS bank_account_details,
        JSON_OBJECT(
          'username', vpaud.username,
          'handle', vpaud.handle,
          'address', vpaud.address
          ) AS upi_details
        `,
        ),
      )
      .join(
        'virtual_payment_account_details AS vpad',
        'vpad.razorpay_customer_id',
        'orc.razorpay_customer_id',
      )
      .joinRaw(
        `
        LEFT JOIN
        virtual_payment_bank_account_details vpbad ON vpbad.vpa_details_id = vpad.id
            AND vpbad.is_deleted = 0
        `,
      )
      .joinRaw(
        `
        LEFT JOIN
        virtual_payment_account_upi_details vpaud ON vpaud.vpa_details_id = vpad.id
            AND vpaud.is_deleted = 0
        `,
      )
      .where({
        'orc.is_deleted': 0,
        'vpad.is_deleted': 0,
        'orc.locofastroot_id': orgId,
      })
      .first();
  }

  async getRazorpayCustomerDetails(
    razorpayCustomerId: number | string,
  ): Promise<Record<string, any>> {
    return this.query()
      .alias('orc')
      .withGraphJoined(
        `[
          customer(defaultSelects, selectEmail).organizationUsers(defaultSelects),
          accountManager().[
            userDetails(defaultSelects, selectEmail, selectPhone),
            userManagerMapping().managerDetails(defaultSelects, selectEmail),
          ]
        ]`,
      )
      .where({
        'orc.is_deleted': 0,
        'orc.razorpay_customer_id': razorpayCustomerId,
      })
      .first();
  }
}
