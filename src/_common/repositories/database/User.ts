import { User } from '../../models';
import { Injectable } from '@nestjs/common';
import { DatabaseRepository as DB, InjectModel } from '@libs/core';
import { UserContract } from '../contracts';
import { ACTIVATION_STATUS } from '@app/_common/constants';

@Injectable()
export class UserRepository extends DB implements UserContract {
  @InjectModel(User)
  model: User;

  async getWelcomeMessageUserDetails(
    userIds: number[],
  ): Promise<Record<string, any>[]> {
    return this.query()
      .alias('u')
      .select('u.id', 'u.name', 'u.whatsapp_number')
      .whereRaw(`u.whatsapp_number IS NOT NULL`)
      .whereIn('u.id', userIds)
      .whereNotIn('u.brand', JSON.parse(process.env.WHITELISTED_SUPPLIER_IDS));
  }

  async getUserDetailsByOrgIdsForWhatsapp(
    orgIds: number[],
  ): Promise<Record<string, any>[]> {
    return this.query()
      .alias('u')
      .select(
        'u.brand as org_id',
        'u.id',
        'u.name',
        'u.role',
        'u.whatsapp_number',
      )
      .where({
        'u.status': ACTIVATION_STATUS.ACTIVE,
        'u.is_enabled': 1,
      })
      .whereNotNull('u.whatsapp_number')
      .whereIn('u.brand', orgIds)
      .whereNotIn('u.brand', JSON.parse(process.env.WHITELISTED_SUPPLIER_IDS));
  }

  async getAssignedAccountManager(orgId: number): Promise<Record<string, any>> {
    return this.query()
      .alias('u')
      .select(
        'u.name as account_manager_name',
        'u.phone as account_manager_phone',
        'user.name as customer_user_name',
        'user.email as customer_user_email',
      )
      .join('user_org as uo', 'u.id', 'uo.user_id')
      .join('users as user', 'user.brand', 'uo.locofastroot_id')
      .where({ 'uo.locofastroot_id': orgId, 'uo.is_deleted': 0 })
      .first();
  }
}
