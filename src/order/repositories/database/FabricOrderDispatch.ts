import { Injectable } from '@nestjs/common';
import { DatabaseRepository as DB, InjectModel } from '@libs/core';
import { FabricOrderDispatchContract } from '../contracts';
import { FabricOrderDispatch } from '@app/order/models';

@Injectable()
export class FabricOrderDispatchRepository
  extends DB
  implements FabricOrderDispatchContract
{
  @InjectModel(FabricOrderDispatch)
  model: FabricOrderDispatch;
}
