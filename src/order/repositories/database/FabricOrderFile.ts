import { Injectable } from '@nestjs/common';
import { DatabaseRepository as DB, InjectModel } from '@libs/core';
import { FabricOrderFileContract } from '../contracts';
import { FabricOrderFiles } from '@app/order/models';

@Injectable()
export class FabricOrderFileRepository
  extends DB
  implements FabricOrderFileContract
{
  @InjectModel(FabricOrderFiles)
  model: FabricOrderFiles;
}
