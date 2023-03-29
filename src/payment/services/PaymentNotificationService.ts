/*import { FabricOrderContract, FABRIC_ORDER_REPOSITORY } from '@app/order';
import {
  getNotificationUserDetails,
  LfRootContract,
  LfRootService,
  LF_ROOT_REPOSITORY,
  notificationUserRoles,
} from '@app/_common';
import { Injectable, Inject, forwardRef } from '@nestjs/common';

@Injectable()
export class PaymentNotificationService {
  constructor(
    @Inject(forwardRef(() => FABRIC_ORDER_REPOSITORY))
    private fabricOrder: FabricOrderContract,
    @Inject(forwardRef(() => LfRootService))
    private locofastrootService: LfRootService,
  ) {}

  async getPaymentGatewayOrderNotificationDetails(
    inputs: Record<string, any>,
  ): Promise<Record<string, any>> {
    const { orderId, eventType } = inputs;
    const userRoles = notificationUserRoles(Number(eventType));

    const orderPaymentDetails = await this.fabricOrder.getOrderDetails({
      orderId,
    });
    const [{ fabric, paymentDetails }] = orderPaymentDetails;
    const customerUserDetails =
      await this.locofastrootService.getOrgUserDetails([fabric.customer.id]);

    const userData = getNotificationUserDetails({
      userRoles,
      orgUserDetails: customerUserDetails,
    });

    const notificationData = {
      orderPaymentDetails: {
        fabricCurrency: fabric.fabricCurrency,
        paymentDetails,
      },
      userData,
    };

    return notificationData;
  }

  async getVPAOrderNotificationDetails(
    inputs: Record<string, any>,
  ): Promise<Record<string, any>> {
    const { customerId, eventType } = inputs;
    const userRoles = notificationUserRoles(Number(eventType));

    const customerUserDetails =
      await this.locofastrootService.getOrgUserDetails([customerId]);

    const userData = getNotificationUserDetails({
      userRoles,
      orgUserDetails: customerUserDetails,
    });

    const notificationData = {
      userData,
    };

    return notificationData;
  }
}*/
