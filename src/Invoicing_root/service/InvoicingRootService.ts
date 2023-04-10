import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { transaction } from 'objection';
import { Response } from '@libs/core';
import { BaseValidator } from '@libs/core/validator';
import { InvoicingCustomerValidator } from '../validators/InvoicingCustomerValidator';
import * as crypto from 'crypto';
import {
  BRAND_TYPE,
  CREDIT_INFO_REPO,
  InvoicingRootContract,
  InvoicingUserContract,
  INVOICING_ROOT_REPO,
  INVOICING_USER_REPO,
  ROOT_USER_TYPES,
} from '@app/_common';
import { InvoicingRoot } from '@app/_common/models/InvoicingRoot';
import { CreditInfoContract } from '@app/_common/repositories/contracts/CreditInfo';
import { CommonService } from '@app/_common/services/Commonservice';

@Injectable()
export class InvoicingRootService {
  constructor(
    private validator: BaseValidator,
    @Inject(INVOICING_USER_REPO)
    private InvoicingUserRepo: InvoicingUserContract,

    @Inject(INVOICING_ROOT_REPO)
    private InvoicingRootRepo: InvoicingRootContract,

    @Inject(CREDIT_INFO_REPO)
    private CreditInfoRepo: CreditInfoContract,
    private commonService: CommonService,
  ) {}

  async findById(id: number) {
    return this.InvoicingRootRepo.firstWhere({ id });
  }
  async createInvoicingRoot(
    inputs: Record<string, any>,
    user: Record<string, any>,
  ): Promise<Record<string, any>> {
    const { userId, status = 1, creditCharges = 2, credit_period } = inputs;

    await this.validator.fire(inputs, InvoicingCustomerValidator);

    const trx = await InvoicingRoot.startTransaction();
    const financeManager = 1;
    const brandSecretKey = crypto.randomBytes(16).toString('hex');
    const userSecretKey = crypto.randomBytes(16).toString('hex');
    const brandtype = BRAND_TYPE.CUSTOMER;
    const role = ROOT_USER_TYPES.CREDIT_CUSTOMER;
    const res1 = await this.commonService.getUserdata(userId);
    console.log(res1);
    const brandId = res1.data.brand;
    const email = res1.data.email;
    const firstName = res1.data.firstName;
    const lastName = res1.data.lastName;
    const phoneNo = res1.data.phone;

    const res = await this.commonService.getCustomerdata(+brandId);
    console.log(res);

    const gst = res.data.gstNumber;
    const name = res.data.name;

    try {
      const result = await this.InvoicingRootRepo.query(trx).insert({
        brandId,
        name,
        brandtype,
        gst,
        secretKey: brandSecretKey,
        status: 1,
        createdBy: financeManager,
        modifiedBy: financeManager,
      });

      const InvoicingRootId = result.id;
      await this.InvoicingUserRepo.query(trx).insert({
        userId,
        brandId,
        rootId: InvoicingRootId,
        firstName,
        lastName,
        role,
        phoneNo,
        userSecretKey,
        createdBy: financeManager,
        modifiedBy: financeManager,
      });

      const result3 = await this.CreditInfoRepo.query(trx).insert({
        customer_id: InvoicingRootId,
        creditCharges,
        is_credit_available: 1,
        credit_period,
      });

      await trx.commit();
      return result;
    } catch (error) {
      console.error('Error in creating customer via self-onbaording: ', error);
      await trx.rollback();

      throw new InternalServerErrorException('Something went wrong');
    }
  }

  //supplier name (existing)

  // payment info (sid)
  async getPaymentInfo(inputs): Promise<Record<string, any>> {
    const id = inputs.brand_id;
    if (id != ROOT_USER_TYPES.CREDIT_CUSTOMER) {
      return { message: 'No customer exists with this id' };
    }
    return await this.InvoicingRootRepo.getCreditInfo(id);

    // return await
  }

  // Invoicing days
  // Invoicing charges

  // customer name
  //realtionship manager
  //inputting supplier list
  //get brand name
  //getorde

  async get(inputs, user): Promise<Response> {
    const id = inputs.id;

    return;
  }
}
function getPaymentInfo(inputs: any) {
  throw new Error('Function not implemented.');
}
