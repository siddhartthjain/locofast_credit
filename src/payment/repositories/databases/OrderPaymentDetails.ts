import { Injectable } from '@nestjs/common';
import { DatabaseRepository, InjectModel } from '@libs/core';
import { OrderPaymentDetails } from '../../models';
import { OrderPaymentDetailsContract } from '../contracts';

@Injectable()
export class OrderPaymentDetailsRepository
  extends DatabaseRepository
  implements OrderPaymentDetailsContract
{
  @InjectModel(OrderPaymentDetails)
  model: OrderPaymentDetails;

  async getOrderPaymentDetails(
    orderPaymentId: number,
    getOrgDetails: boolean,
    getOrgAccountManager: boolean,
  ): Promise<Record<string, any>> {
    return this.query()
      .alias('opd')
      .select(
        'opd.cheque_number',
        'opd.cheque_amount',
        'opd.cheque_due_date',
        'lf.name as customerName',
        'lf.email as customerEmail',
        'customer_user.name as customerUserName',
        'account_manager_user.name as accountManagerName',
        'account_manager_user.email as accountManagerEmail',
      )
      .where({
        'opd.id': orderPaymentId,
        'opd.is_deleted': 0,
      })
      .join('locofastroot as lf', 'lf.id', 'opd.customer_id')
      .modify((query) => {
        if (getOrgDetails) {
          query.joinRaw(
            `
              LEFT JOIN users AS customer_user
              ON customer_user.brand = lf.id
                AND customer_user.status = 'Y'
            `,
          );
        }
        if (getOrgAccountManager) {
          query
            .joinRaw(
              `
              LEFT JOIN user_org AS uo
              ON uo.locofastroot_id = lf.id
                AND uo.is_deleted = '0'
            `,
            )
            .joinRaw(
              `
                LEFT JOIN users AS account_manager_user
                ON account_manager_user.id = uo.user_id
                  AND account_manager_user.status = 'Y'
              `,
            );
        }
      })
      .first();
  }
}
