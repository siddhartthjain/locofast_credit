import { Injectable } from '@nestjs/common';
import { VirtualPaymentAccountUpiDetails } from '../../models';
import { DatabaseRepository, InjectModel } from '@libs/core';
import { VirtualPaymentAccountUpiDetailsContract } from '../contracts';

@Injectable()
export class VirtualPaymentAccountUpiDetailsRepository
  extends DatabaseRepository
  implements VirtualPaymentAccountUpiDetailsContract
{
  @InjectModel(VirtualPaymentAccountUpiDetails)
  model: VirtualPaymentAccountUpiDetails;
}
