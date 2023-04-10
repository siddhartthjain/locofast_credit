import { DatabaseRepository as DB, InjectModel } from '@libs/core';
import { Injectable } from '@nestjs/common';
import { FabricOrderDipatchContract } from '../contracts';
import { FabricOrderDispatch } from '@app/order/models';

@Injectable()
export class FabricOrderDispatchRepository
  extends DB
  implements FabricOrderDipatchContract
{
  @InjectModel(FabricOrderDispatch)
  model: FabricOrderDispatch;
}
