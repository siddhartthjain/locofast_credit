import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { transaction } from 'objection';
import { Response } from '@libs/core';;
import { BaseValidator } from '@libs/core/validator';
import { InvoicingCustomerValidator } from '../validators/InvoicingCustomerValidator';
import * as crypto from "crypto";
import { CREDIT_INFO_REPO, InvoicingRootContract, InvoicingUserContract, INVOICING_ROOT_REPO, INVOICING_USER_REPO, ROOT_USER_TYPES } from '@app/_common';
import { InvoicingRoot } from '@app/_common/models/InvoicingRoot';
import { CreditInfoContract } from '@app/_common/repositories/contracts/CreditInfo';



@Injectable()
export class InvoicingRootService {
  constructor(
    private validator : BaseValidator,
    @Inject(INVOICING_USER_REPO)
    private InvoicingUserRepo : InvoicingUserContract,

    @Inject(INVOICING_ROOT_REPO)
    private InvoicingRootRepo : InvoicingRootContract,

    @Inject(CREDIT_INFO_REPO)
    private CreditInfoRepo : CreditInfoContract

  ) {}

  

  async createInvoicingRoot(inputs :Record<string,any>, user: Record<string,any> ) {
    const {

      user_id, 
      brand_id,  
      first_name,
      last_name = '',
      name ,
      is_active = 1,
      credit_charges = 2,
      GST,
      phone_no,
      credit,

    } = inputs;

    await this.validator.fire(inputs, InvoicingCustomerValidator);
    const trx = await InvoicingRoot.startTransaction(); 
    const financeManager = 1;
    const brandSecretKey = crypto.randomBytes(16).toString('hex');
    const userSecretKey = crypto.randomBytes(16).toString('hex');
    const brandtype = ROOT_USER_TYPES.CREDIT_CUSTOMER;
    try
    {
      const result = await this.InvoicingRootRepo.query(trx).insert({
        
        brand_id,
        name,
        brandtype,
        gst :GST,
        secret_key:brandSecretKey,
        is_active,
        created_by: financeManager,
        modified_by: financeManager

      });

      const InvoicingRootId= result.id;
      const result2= await this.InvoicingUserRepo.query(trx).insert({
        user_id,
        brand_id,
        root_id:InvoicingRootId,
        first_name,
        last_name,
        phone_no,
        userSecretKey,
        created_by:financeManager,
        modified_by: financeManager
      })
       
      const result3= await this.CreditInfoRepo.query(trx).insert({
        customer_id: InvoicingRootId,
        credit,
        is_credit_available:1,
        credit_charges
        
      })

        await trx.commit();
    }
     catch (error) {

      console.error('Error in creating customer via self-onbaording: ', error);
      await trx.rollback();
      
      throw new InternalServerErrorException('Something went wrong');
    }
  }
  
  //supplier name (existing)
  
  // payment info (sid)
  async getPaymentInfo(inputs): Promise<Record<string,any>>
 {
  const id = inputs.brand_id;
  if(id != ROOT_USER_TYPES.CREDIT_CUSTOMER)
  {
    return {message: "No customer exists with this id"};
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

