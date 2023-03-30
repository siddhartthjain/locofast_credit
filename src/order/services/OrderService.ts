import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FabricContract } from 'src/fabric';
import {
  FABRIC_ORDER_DELIVERY_ADDRESS_REPOSITORY,
  FABRIC_ORDER_REPOSITORY,
  ORDER_STATUS,
} from '../constants';
import { checkQuantity } from '../helpers';
import { FabricOrder } from '../models';

@Injectable()
export class OrderService {
  constructor(
    @Inject(FABRIC_ORDER_REPOSITORY) private fabricOrder: FabricContract,
  ) {}
  async dispatchOrder(inputs: Record<string, any>) {
    const { orderId } = inputs;
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
    const { orderId } = inputs;
    // will have files too
    /* will have role base check to either it 
    is mark delivered by supplier or mark received 
    by customer
    */
    const trx = await FabricOrder.startTransaction();
    try {
      await this.fabricOrder
        .query(trx)
        .patch({
          status: ORDER_STATUS.DELIVERED,
        })
        .where({
          id: orderId,
        });
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
    const { orderId, quantity, dispatchDate } = inputs;
    const fabricOrder = await this.fabricOrder.firstWhere({ id: orderId });
    if (!checkQuantity(fabricOrder.quantity, quantity)) {
      throw new UnprocessableEntityException('This is not the order quantity');
    }
    const dispatchDetails = {
      quantity,
      dispatch_date: dispatchDate,
    };
    return { dispatchDetails };
  }
}
