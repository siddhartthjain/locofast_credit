import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ValidationFailed } from '@libs/core';
import { FabricService } from 'src/fabric/services';
import {
  FABRIC_ORDER_DELIVERY_ADDRESS_REPOSITORY,
  FABRIC_ORDER_REPOSITORY,
} from '../constants';
import { FabricOrder } from '../models';
import {
  FabricOrderContract,
  FabricOrderDeliveryAddressContract,
} from '../repositories';
import { CreateProvisionalOrder } from '../validators';
import { BaseValidator } from '@libs/core/validator';

@Injectable()
export class ProvisionalOrderService {
  constructor(
    private validator: BaseValidator,
    @Inject(FABRIC_ORDER_REPOSITORY) private fabricOrder: FabricOrderContract,
    @Inject(FABRIC_ORDER_DELIVERY_ADDRESS_REPOSITORY)
    private fabricOrderDeliveryAddress: FabricOrderDeliveryAddressContract,
    private fabricService: FabricService,
  ) {}

  async createProvisionalOrder(
    inputs: Record<string, any>,
  ): Promise<Record<string, any>> {
    // need to add validation here
    // will have user too in input
    // billTo will be constant (need to discuss)
    const data = await this.fabricOrder.all();
    console.log(data);
    return;
    inputs.billTo = 'Locofast Online Private Limited';
    const { fabricDetails, fabricOrderDeliveryDetails, fabricOrderDetails } =
      await this.createProvisionalOrderCustomValidator(inputs);

    let fabricOrder;
    // will calculate using customer credit info
    const finalPrice = 2000;
    const trx = await FabricOrder.startTransaction();
    try {
      const fabric = await this.fabricService.addFabric(fabricDetails, trx);
      const orderDeliveryDetails = await this.fabricOrderDeliveryAddress
        .query(trx)
        .insert(fabricOrderDeliveryDetails);
      fabricOrder = await this.fabricOrder.query(trx).insert({
        ...fabricOrderDetails,
        fabric_id: fabric.id,
        delivery_id: orderDeliveryDetails.id,
        final_price: finalPrice,
      });
      await trx.commit();
    } catch (error) {
      console.log('Error in creating Order: ', error);
      await trx.rollback();
      throw new InternalServerErrorException('Something went wrong');
    }
    return fabricOrder;
  }

  private async createProvisionalOrderCustomValidator(
    inputs: Record<string, any>,
  ): Promise<Record<string, any>> {
    const {
      brandId,
      fabricName,
      fabricSpecification,
      hsnCode,
      billTo,
      estimatedDeliveryDate,
      terms = '',
      supplierId,
      quantity,
      procurementPrice,
      unitId,
      brandDeliveryAddressId,
    } = inputs;

    await this.validator.fire(inputs, CreateProvisionalOrder);
    /* const hsnRegex = new RegExp(
      '/^[0-9]{2}s*[0-9]{2}s*[0-9]{2}s*[0-9]{2}s*[0-9]{2}$/',
    );
    if (!hsnRegex.test(hsnCode)) {
      console.log('shi dal le hsn code');
      throw new ValidationFailed({
        message: 'Wrong HSN code',
      });
    }*/

    const fabricDetails = {
      brandId,
      fabricName,
      fabricSpecification,
      hsnCode,
    };

    const fabricOrderDeliveryDetails = {
      billTo,
      estimatedDeliveryDate,
      terms,
      brand_address_id: brandDeliveryAddressId,
      created_by: 1342,
      modified_by: 1342,
    };

    const fabricOrderDetails = {
      customer_id: brandId,
      supplierId: supplierId,
      quantity,
      procurement_price: procurementPrice,
      unit_id: unitId,
      created_by: 1342,
      modified_by: 1342,
    };

    return {
      fabricDetails,
      fabricOrderDeliveryDetails,
      fabricOrderDetails,
    };
  }
}
