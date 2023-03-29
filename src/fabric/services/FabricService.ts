import { Inject, Injectable } from '@nestjs/common';
import * as Knex from 'knex';
import { FABRIC_REPOSITORY } from '../constants';
import { composeGeneratedFabricID } from '../helpers';
import { Fabric } from '../models';
import { FabricContract } from '../repositories';

@Injectable()
export class FabricService {
  constructor(@Inject(FABRIC_REPOSITORY) private fabric: FabricContract) {}
  async addFabric(
    inputs: Record<string, any>,
    trx?: Knex.Transaction,
  ): Promise<Record<string, any>> {
    // need to add validation here
    // will have user too in input
    // need to make interface for inputs too
    const { brandId, fabricName, fabricSpecification, hsnCode } = inputs;

    const Fabric = await this.fabric.query(trx).insert({
      customer_id: brandId,
      fabric_name: fabricName,
      fabric_specification: fabricSpecification,
      hsn_code: hsnCode,
      created_by: 1342,
      modified_by: 1342,
    });
    const generatedFabricId = composeGeneratedFabricID(Fabric.id);
    await this.fabric
      .query(trx)
      .patch({
        generated_fabric_id: generatedFabricId,
      })
      .where({
        id: Fabric.id,
      });
    return Fabric;
  }
}
