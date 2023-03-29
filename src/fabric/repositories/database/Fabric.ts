import { DatabaseRepository as DB, InjectModel } from '@libs/core';
import { Injectable } from '@nestjs/common';
import { Fabric } from 'src/fabric/models';
import { FabricContract } from '../contracts';

@Injectable()
export class FabricRepository extends DB implements FabricContract {
  @InjectModel(Fabric)
  model: Fabric;
}
