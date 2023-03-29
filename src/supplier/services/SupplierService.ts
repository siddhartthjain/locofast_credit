import { Inject, Injectable } from '@nestjs/common';
import { SUPPLIER_REPOSITORY } from '../constants';
import { SupplierContract } from '../repositories';

@Injectable()
export class SupplierService {
  constructor(
    @Inject(SUPPLIER_REPOSITORY) private supplier: SupplierContract,
  ) {}

  async addSupplier(inputs: Record<string, any>): Promise<Record<string, any>> {
    // need to add validation here (will do later)
    // will have user too in input
    const { gst_number, first_name, last_name, contact_number, email } = inputs;
    // need to add gst check (to avoid same suppliers)
    const supplier = await this.supplier.create({     // supplier table
      gst_number,
      first_name,
      last_name,
      contact_number,
      email,
      created_by: 1342,
      modified_by: 1342,
    });
    return supplier;
  }
}
