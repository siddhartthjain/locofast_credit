import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { FabricService } from 'src/fabric/services';
import {
  FABRIC_ORDER_DELIVERY_ADDRESS_REPOSITORY,
  FABRIC_ORDER_META_DATA_REPOSITORY,
  FABRIC_ORDER_REPOSITORY,
} from '../constants';
import { FabricOrder } from '../models';
import {
  FabricOrderContract,
  FabricOrderDeliveryAddressContract,
  FabricOrderMetaDataContract,
} from '../repositories';
import { CreateProvisionalOrder, DeliveryAddress } from '../validators';
import { BaseValidator } from '@libs/core/validator';
import { BILL_TO, getFormattedDateString } from '@app/_common';
import { calculateCreditPrice, calculateOrderValue } from '../helpers';

@Injectable()
export class ProvisionalOrderService {
  constructor(
    private validator: BaseValidator,
    @Inject(FABRIC_ORDER_REPOSITORY) private fabricOrder: FabricOrderContract,
    @Inject(FABRIC_ORDER_DELIVERY_ADDRESS_REPOSITORY)
    private fabricOrderDeliveryAddress: FabricOrderDeliveryAddressContract,
    @Inject(FABRIC_ORDER_META_DATA_REPOSITORY)
    private fabricOrderMetaData: FabricOrderMetaDataContract,
    private fabricService: FabricService,
  ) {}

  async createProvisionalOrder(
    inputs: Record<string, any>,
  ): Promise<Record<string, any>> {
    // will have user too in input
    const {
      fabricDetails,
      fabricOrderDeliveryDetails,
      fabricOrderDetails,
      fabricOrderMetadata,
    } = await this.createProvisionalOrderCustomValidator(inputs);

    let fabricOrder;
    const trx = await FabricOrder.startTransaction();
    try {
      const fabric = await this.fabricService.addFabric(fabricDetails, trx);
      fabricOrder = await this.fabricOrder.query(trx).insert({
        ...fabricOrderDetails,
        fabric_id: fabric.id,
      });
      await this.fabricOrderDeliveryAddress.query(trx).insert({
        ...fabricOrderDeliveryDetails,
        order_id: fabricOrder.id,
      });
      await this.fabricOrderMetaData.query(trx).insert({
        ...fabricOrderMetadata,
        order_id: fabricOrder.id,
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
      supplierId,
      quantity,
      procurementPrice,
      unitId,
      deliveryDetails,
    } = inputs;
    await this.validator.fire(inputs, CreateProvisionalOrder);
    await this.validator.fire(deliveryDetails, DeliveryAddress);
    // will be check from database
    const creditCharges = 2;
    const orderValue = calculateOrderValue(procurementPrice, quantity);
    const creditPrice = calculateCreditPrice(orderValue, creditCharges);
    deliveryDetails.estimatedDeliveryDate = getFormattedDateString(
      deliveryDetails.estimatedDeliveryDate,
    );
    deliveryDetails.billTo = BILL_TO;
    const fabricDetails = {
      brandId,
      fabricName,
      fabricSpecification,
      hsnCode,
    };

    const fabricOrderDeliveryDetails = {
      ...deliveryDetails,
      created_by: 2,
      modified_by: 2,
    };

    const fabricOrderDetails = {
      customer_id: brandId,
      supplierId: supplierId,
      quantity,
      procurement_price: procurementPrice,
      unit_id: unitId,
      order_value: orderValue,
      created_by: 2,
      modified_by: 2,
    };

    const fabricOrderMetadata = {
      order_value: orderValue,
      payable_amount: creditPrice,
      // both will be calculated from the DB
      credit_period: 30,
      credit_charges: 2,
      // will came from user
      created_by: 2,
      modified_by: 2,
    };

    return {
      fabricDetails,
      fabricOrderDeliveryDetails,
      fabricOrderDetails,
      fabricOrderMetadata,
    };
  }
}
