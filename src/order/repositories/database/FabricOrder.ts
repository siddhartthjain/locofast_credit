import { Injectable } from '@nestjs/common';
import { DatabaseRepository as DB, InjectModel } from '@libs/core';
import { FabricContract } from 'src/fabric/repositories';
import { FabricOrder } from 'src/order/models';
@Injectable()
export class FabricOrderRepository extends DB implements FabricContract {
  @InjectModel(FabricOrder)
  model: FabricOrder;
}
