import { Injectable } from '@nestjs/common';
import { FabricOrderPaymentDetails } from '../../models';
import { DatabaseRepository, InjectModel } from '@libs/core';
import { FabricOrderPaymentDetailsContract } from '../contracts';

@Injectable()
export class FabricOrderPaymentDetailsRepository
  extends DatabaseRepository
  implements FabricOrderPaymentDetailsContract
{
  @InjectModel(FabricOrderPaymentDetails)
  model: FabricOrderPaymentDetails;
}
