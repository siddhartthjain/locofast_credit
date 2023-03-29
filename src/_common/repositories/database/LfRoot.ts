import { Locofastroot } from '../../models';
import { Injectable } from '@nestjs/common';
import { DatabaseRepository as DB, InjectModel } from '@libs/core';
import { LfRootContract } from '../contracts';
import { raw } from 'objection';

@Injectable()
export class LfRootRepository extends DB implements LfRootContract {
  @InjectModel(Locofastroot)
  model: Locofastroot;

  async getOrgUserDetails(
    orgIds: Array<number>,
  ): Promise<Array<Record<string, any>>> {
    return this.query()
      .alias('lf')
      .select(
        'lf.id as org_id',
        'lf.is_international',
        'u.id',
        'u.name',
        'u.phone',
        'u.email',
        'u.role',
      )
      .join('users as u', 'u.brand', 'lf.id')
      .where({
        'lf.status': 'Y',
        'u.is_enabled': 1,
      })
      .whereIn('lf.id', orgIds);
  }

  async getOrgDetails(orgId: number): Promise<Record<string, any>> {
    return this.query()
      .alias('lf')
      .select(
        'lf.id',
        'lf.name',
        'lf.gst_number',
        raw(`
          JSON_OBJECT(
            'id', fcd.created_by,
            'name', u.name
          ) as account_created_by
        `),
      )
      .innerJoin('fabric_customer_details as fcd', 'fcd.customer_id', 'lf.id')
      .leftJoin('users as u', 'u.id', 'fcd.createdBy')
      .where({ 'lf.id': orgId })
      .first();
  }
}
