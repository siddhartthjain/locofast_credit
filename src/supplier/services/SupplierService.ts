import { BaseValidator } from '@libs/core/validator';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FabricSupplierAddressContract } from '../repositories';
import { CreateSupplier } from '../validators/CreateSupplier';
import {
  FABRIC_SUPPLIER_ORG_ROLE,
  INVOICING_ROOT_REPO,
  INVOICING_USER_REPO,
  InvoicingRoot,
  InvoicingRootContract,
  InvoicingUserContract,
  ROOT_USER_TYPES,
} from '@app/_common';
import * as crypto from 'crypto';
import { SupplierAddress } from '../validators';
import { FABRIC_SUPPLIER_ADDRESS_REPOSITORY } from '../constants';

@Injectable()
export class SupplierService {
  constructor(
    private validator: BaseValidator,
    @Inject(FABRIC_SUPPLIER_ADDRESS_REPOSITORY)
    private fabricSupplierAddress: FabricSupplierAddressContract,
    @Inject(INVOICING_ROOT_REPO) private invoicingRoot: InvoicingRootContract,
    @Inject(INVOICING_USER_REPO) private invoicingUser: InvoicingUserContract,
  ) {}

  async addSupplier(inputs: Record<string, any>) {
    const { supplierDetails, supplierUserDetails, supplierAddressDetails } =
      await this._createSupplierCustomValidation(inputs);

    const brandSecretKey = crypto.randomBytes(16).toString('hex');
    const userSecretKey = crypto.randomBytes(16).toString('hex');

    const trx = await InvoicingRoot.startTransaction();
    try {
      const supplier = await this.invoicingRoot.query(trx).insert({
        ...supplierDetails,
        secretKey: brandSecretKey,
      });

      await this.invoicingUser.query(trx).insert({
        ...supplierUserDetails,
        rootId: supplier.id,
        userSecretKey,
      });

      await this.fabricSupplierAddress.query(trx).insert({
        ...supplierAddressDetails,
        supplierId: supplier.id,
      });
      await trx.commit();
    } catch (error) {
      console.log('Error in creating Order: ', error);
      await trx.rollback();
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async searchSuppliers(inputs: Record<string, any>) {
    const suppliers = await this.invoicingRoot.searchSuppliers(inputs);
    return suppliers;
  }

  async _createSupplierCustomValidation(
    inputs: Record<string, any>,
  ): Promise<Record<string, any>> {
    await this.validator.fire(inputs, CreateSupplier);
    await this.validator.fire(inputs.addressDetails, SupplierAddress);
    const {
      gstNumber,
      firstName,
      lastName,
      contactNumber,
      email,
      addressDetails,
    } = inputs;
    const {
      tradeName,
      buildingName = '',
      doorNumber = '',
      location = '',
      pincode = '',
      stateName = '',
      street = '',
    } = addressDetails;
    const user = await this.invoicingUser.exists({ phoneNo: contactNumber });
    if (user) {
      throw new UnprocessableEntityException(
        'Supplier With This Phone Number Already Exist!',
      );
    }
    const supplierDetails = {
      name: tradeName,
      brandType: FABRIC_SUPPLIER_ORG_ROLE,
      gst: gstNumber,
      created_by: 2,
      modified_by: 2,
    };

    const supplierUserDetails = {
      role: ROOT_USER_TYPES.SUPPLIER,
      firstName,
      lastName,
      phoneNo: contactNumber,
      email,
      created_by: 2,
      modified_by: 2,
    };

    const supplierAddressDetails = {
      buildingName,
      doorNumber,
      location,
      pincode,
      stateName,
      street,
      created_by: 2,
      modified_by: 2,
    };

    return {
      supplierDetails,
      supplierUserDetails,
      supplierAddressDetails,
    };
  }
}
