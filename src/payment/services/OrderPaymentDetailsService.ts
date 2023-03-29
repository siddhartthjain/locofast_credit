import { Inject, Injectable } from '@nestjs/common';
import { ORDER_PAYMENT_DETAILS_REPOSITORY } from '../constants';
import { OrderPaymentDetailsContract } from '../repositories';

@Injectable()
export class OrderPaymentDetailsService {
  constructor(
    @Inject(ORDER_PAYMENT_DETAILS_REPOSITORY)
    private orderPaymentDetails: OrderPaymentDetailsContract,
  ) {}

  async getOrderPaymentDetails(
    inputs: Record<string, any>,
  ): Promise<Record<string, any>> {
    const { orderPaymentId, getOrgDetails, getOrgAccountManager } = inputs;
    const orderPaymentDetails =
      await this.orderPaymentDetails.getOrderPaymentDetails(
        orderPaymentId,
        !!getOrgDetails,
        !!getOrgAccountManager,
      );
    return orderPaymentDetails;
  }
}
