import { Injectable } from '@nestjs/common';
import { VirtualPaymentBankAccountDetails } from '../../models';
import { DatabaseRepository, InjectModel } from '@libs/core';
import { VirtualPaymentBankAccountDetailsContract } from '../contracts';

@Injectable()
export class VirtualPaymentBankAccountDetailsRepository
  extends DatabaseRepository
  implements VirtualPaymentBankAccountDetailsContract
{
  @InjectModel(VirtualPaymentBankAccountDetails)
  model: VirtualPaymentBankAccountDetails;
}
