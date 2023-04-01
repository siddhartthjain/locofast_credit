import { getFormattedDateString } from '@app/_common';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import moment from 'moment';
import { FabricContract } from 'src/fabric';
import {
  FABRIC_ORDER_DELIVERY_ADDRESS_REPOSITORY,
  FABRIC_ORDER_DISPATCH_REPOSITORY,
  FABRIC_ORDER_REPOSITORY,
  ORDER_STATUS,
} from '../constants';
import { checkQuantity } from '../helpers';
import { FabricOrder } from '../models';
import { FabricOrderDispatchContract } from '../repositories';
import { BaseValidator } from '@libs/core/validator';
import { DeliveredOrder } from '../validators/DeliveredOrder';

@Injectable()
export class OrderService {
  constructor(
    @Inject(FABRIC_ORDER_REPOSITORY) private fabricOrder: FabricContract,
    @Inject(FABRIC_ORDER_DISPATCH_REPOSITORY)
    private fabricOrderDispatch: FabricOrderDispatchContract,
    private validator: BaseValidator,
  ) {}

  async raisePo(inputs: Record<string, any>) {
    const { orderId } = inputs;
    await this.fabricOrder
      .query()
      .patch({
        status: ORDER_STATUS.CREATED,
      })
      .where({
        id: orderId,
        status: ORDER_STATUS.PROVISIONAL,
      });

    return;
  }

  async dispatchOrder(inputs: Record<string, any>) {
    const { orderId } = inputs;
    const { dispatchDetails } = await this.dispatchOrderCustomValidator(inputs);

    // will have files too
    const trx = await FabricOrder.startTransaction();
    try {
      await this.fabricOrder
        .query(trx)
        .patch({
          status: ORDER_STATUS.DISPATCHED,
          modified_by: 2,
        })
        .where({
          id: orderId,
        });

      await this.fabricOrderDispatch.query(trx).insert(dispatchDetails);

      // have to upload files too
      await trx.commit();
    } catch (error) {
      console.log('Error marking order dispatch: ', error);
      await trx.rollback();
      throw new InternalServerErrorException('Something went wrong');
    }
    return;
  }

  async markOrderDelivered(inputs: Record<string, any>) {
    const { deliveredDate } = await this.markOrderDeliveredCustomValidator(
      inputs,
    );

    const { orderId } = inputs;
    // will have files too

    const trx = await FabricOrder.startTransaction();
    try {
      await this.fabricOrder
        .query(trx)
        .patch({
          status: ORDER_STATUS.DELIVERED,
          markedDeliveredBy: 3,
          modifiedBy: 3,
        })
        .where({
          id: orderId,
        });

      await this.fabricOrderDispatch
        .query(trx)
        .patch({
          deliveredDate,
          modifiedBy: 3,
        })
        .where({ orderId });
      // will have to add modifiedBy field too (Supplier)
      // have to upload files too
      await trx.commit();
    } catch (error) {
      console.log('Error marking order dispatch: ', error);
      await trx.rollback();
      throw new InternalServerErrorException('Something went wrong');
    }
    return;
  }

  async dispatchOrderCustomValidator(
    inputs: Record<string, any>,
  ): Promise<Record<string, any>> {
    const { user, ...resource } = inputs;
    const fabricOrder = await this.fabricOrder.firstWhere({
      id: resource.orderId,
    });

    if (fabricOrder.status != ORDER_STATUS.CREATED) {
      throw new UnprocessableEntityException('Cannot Mark This Order');
    }

    if (!checkQuantity(parseFloat(fabricOrder.quantity), resource.quantity)) {
      throw new UnprocessableEntityException('This is not the order quantity');
    }

    resource.dispatchDate = getFormattedDateString(new Date().toISOString());
    const dispatchDetails = {
      orderId: resource.orderId,
      quantity: resource.quantity,
      dispatch_date: resource.dispatchDate,
      created_by: 3,
      modified_by: 3,
    };
    return { dispatchDetails };
  }

  async markOrderDeliveredCustomValidator(
    inputs: Record<string, any>,
  ): Promise<Record<string, any>> {
    await this.validator.fire(inputs, DeliveredOrder);
    const { orderId } = inputs;
    const fabricOrder = await this.fabricOrder.firstWhere({
      id: orderId,
    });

    if (fabricOrder.status != ORDER_STATUS.DISPATCHED) {
      throw new UnprocessableEntityException('Cannot Mark This Order');
    }

    const deliveredDate = getFormattedDateString(inputs.deliveredDate);
    const diff = moment(deliveredDate).diff(new Date(), 'days');
    if (diff > 60) {
      throw new UnprocessableEntityException(
        'Delivered Cannot Be More Than 60 Days',
      );
    }

    return { deliveredDate };
  }
}
