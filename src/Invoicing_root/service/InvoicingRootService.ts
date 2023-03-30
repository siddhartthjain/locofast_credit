import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { transaction } from 'objection';
import { Response } from '@libs/core';;
import { BaseValidator } from '@libs/core/validator';
import { InvoicingCustomerValidator } from '../validators/InvoicingCustomerValidator';
import * as crypto from "crypto";
import { InvoicingRootContract, InvoicingUserContract, INVOICING_ROOT_REPO, INVOICING_USER_REPO, ROOT_USER_TYPES } from '@app/_common';
import { InvoicingRoot } from '@app/_common/models/InvoicingRoot';



@Injectable()
export class InvoicingRootService {
  constructor(
    private validator : BaseValidator,
    @Inject(INVOICING_USER_REPO)
    private InvoicingUserRepo : InvoicingUserContract,

    @Inject(INVOICING_ROOT_REPO)
    private InvoicingRootRepo : InvoicingRootContract,

  ) {}

  

  async createInvoicingRoot(inputs :Record<string,any>, user: Record<string,any> ) {
    const {
      user_id, 
      brand_id,  
      first_name,
      last_name = '',
      is_Invoicing_available = 1,
      Invoicing_period = 30,
      Invoicing_charges = 2,
    } = inputs;

    await this.validator.fire(inputs, InvoicingCustomerValidator);
    
    const financeManager = user.id;
    const brandSecretKey = crypto.randomBytes(16).toString('hex');
    const userSecretKey = crypto.randomBytes(16).toString('hex');

   
    // newCustomer ={user_id, brand_id, first_name,last_name, is_Invoicing_available, Invoicing_period, Invoicing_charges} 
    const trx = await InvoicingRoot.startTransaction();

    try {
      
      const result = await this.InvoicingRootRepo.query(trx).insert({
        
        brand_id,
        first_name,
        last_name,
        is_Invoicing_available,
        Invoicing_period,
        Invoicing_charges,
        brandSecretKey,
        created_by: financeManager,
        modified_by: financeManager

      });

      const InvoicingRootId= result.id;
      const result2= await this.InvoicingUserRepo.query(trx).insert({
        user_id,
        brand_id,
        Root_id:InvoicingRootId,
        first_name,
        last_name,
        userSecretKey,
        created_by:financeManager,
        modified_by: financeManager
      })
     await trx.commit();

    } catch (error) {
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
