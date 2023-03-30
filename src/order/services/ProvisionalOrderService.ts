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
import { BILL_TO } from '@app/_common';
import { calculateCreditPrice, calculateOrderValue } from '../helpers';

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
    // will have user too in input
    inputs.billTo = BILL_TO;
    const {
      fabricDetails,
      fabricOrderDeliveryDetails,
      fabricOrderDetails,
      orderValue,
      creditPrice,
    } = await this.createProvisionalOrderCustomValidator(inputs);

    let fabricOrder;
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
    // will be check from database
    const creditCharges = 2;
    const orderValue = calculateOrderValue(procurementPrice, quantity);
    const creditPrice = calculateCreditPrice(orderValue, creditCharges);

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
      created_by: 1,
      modified_by: 1,
    };

    const fabricOrderDetails = {
      customer_id: brandId,
      supplierId: supplierId,
      quantity,
      procurement_price: procurementPrice,
      unit_id: unitId,
      order_value: orderValue,
      credit_price: creditPrice,
      created_by: 1,
      modified_by: 1,
    };

    return {
      fabricDetails,
      fabricOrderDeliveryDetails,
      fabricOrderDetails,
    };
  }
}
