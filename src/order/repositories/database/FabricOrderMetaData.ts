import { Injectable } from '@nestjs/common';
import { DatabaseRepository as DB, InjectModel } from '@libs/core';
import { FabricOrderMetaDataContract } from '../contracts';
import { FabricOrderMetaData } from '@app/order/models';

@Injectable()
export class FabricOrderMetaDataRepository
  extends DB
  implements FabricOrderMetaDataContract
{
  @InjectModel(FabricOrderMetaData)
  model: FabricOrderMetaData;
}
