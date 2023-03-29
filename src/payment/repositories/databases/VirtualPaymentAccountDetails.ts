import { Injectable } from '@nestjs/common';
import { VirtualPaymentAccountDetails } from '../../models';
import { DatabaseRepository, InjectModel } from '@libs/core';
import { VirtualPaymentAccountDetailsContract } from '../contracts';

@Injectable()
export class VirtualPaymentAccountDetailsRepository
  extends DatabaseRepository
  implements VirtualPaymentAccountDetailsContract
{
  @InjectModel(VirtualPaymentAccountDetails)
  model: VirtualPaymentAccountDetails;
}
