import { Injectable } from '@nestjs/common';
import { DatabaseRepository as DB, InjectModel } from '@libs/core';
import { Supplier } from 'src/supplier/models';
import { SupplierContract } from '../contracts';

@Injectable()
export class SupplierRepository extends DB implements SupplierContract {
  @InjectModel(Supplier)
  model: Supplier;
}
