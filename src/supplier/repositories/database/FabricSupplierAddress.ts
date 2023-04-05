import { Injectable } from '@nestjs/common';
import { DatabaseRepository as DB, InjectModel } from '@libs/core';
import { FabricSupplierAddressContract } from '../contracts';
import { FabricSupplierAddress } from '@app/supplier/models';

@Injectable()
export class FabricSupplierAddressRepository
  extends DB
  implements FabricSupplierAddressContract
{
  @InjectModel(FabricSupplierAddress)
  model: FabricSupplierAddress;
}
