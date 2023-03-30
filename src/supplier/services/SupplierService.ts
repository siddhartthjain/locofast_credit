import { BaseValidator } from '@libs/core/validator';
import { Inject, Injectable } from '@nestjs/common';
import { SUPPLIER_REPOSITORY } from '../constants';
import { SupplierContract } from '../repositories';
import { CreateSupplier } from '../validators/CreateSupplier';

@Injectable()
export class SupplierService {
  constructor(
    private validator: BaseValidator,
    @Inject(SUPPLIER_REPOSITORY) private supplier: SupplierContract,
  ) {}

  async addSupplier(inputs: Record<string, any>): Promise<Record<string, any>> {
    const { supplierDetails } = await this._createSupplierCustomValidation(
      inputs,
    );
    // need to add gst check (to avoid same suppliers)
    const supplier = await this.supplier.create(supplierDetails);
    return supplier;
  }

  async _createSupplierCustomValidation(
    inputs: Record<string, any>,
  ): Promise<Record<string, any>> {
    await this.validator.fire(inputs, CreateSupplier);
    // duplicate supplier check (with number )
    // require user table for this
    const { gstNumber, firstName, lastName, contactNumber, email } = inputs;
    const supplierDetails = {
      gst_number: gstNumber,
      first_name: firstName,
      last_name: lastName,
      contact_number: contactNumber,
      email,
      // will be changed to user.id
      created_by: 1,
      modified_by: 1,
    };

    return {
      supplierDetails,
    };
  }
}
