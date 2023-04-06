import {
  FABRIC_SUPPLIER_ORG_ROLE,
  ROOT_USER_TYPES,
} from '@app/_common/constants';
import { InvoicingRoot } from '@app/_common/models/InvoicingRoot';
import { DatabaseRepository, InjectModel } from '@libs/core/db/';

import { raw } from 'objection';
import { InvoicingRootContract } from '../contracts/InvoicingRoot';
import { BRAND_TYPE } from '@app/_common/constants';

export class InvoicingRootRepository
  extends DatabaseRepository
  implements InvoicingRootContract
{
  @InjectModel(InvoicingRoot)
  model: InvoicingRoot;

  async getCreditInfo(id: any): Promise<Array<Record<string, any>>> {
    return await InvoicingRoot.query()
      .withGraphFetched('fabric_order')
      .where('id', id)
      .where(raw(`id = ${ROOT_USER_TYPES.CREDIT_CUSTOMER}`));
  }

  async searchSuppliers(
    inputs: Record<string, any>,
  ): Promise<Record<string, any>[]> {
    const { searchText } = inputs;
    const query = this.query()
      .alias('ivroot')
      .select('ivroot.id as supplierId', 'ivroot.name ')
      .where('ivroot.brand_type', FABRIC_SUPPLIER_ORG_ROLE)
      .where('ivroot.name', 'like', `%${searchText}%`);

    const supplierDetails = await query;
    return supplierDetails;
  }
}
