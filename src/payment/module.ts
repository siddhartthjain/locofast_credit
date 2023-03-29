import { OrderModule } from '@app/order/module';
import { CommonModule } from '@app/_common';
import { forwardRef, Module } from '@nestjs/common';
import {
  FABRIC_ORDER_PAYMENT_DETAILS_REPOSITORY,
  ORDER_PAYMENT_DETAILS_REPOSITORY,
  ORG_RAZORPAY_CUSTOMERS,
  VIRTUAL_PAYMENT_ACCOUNT_DETAILS,
  VIRTUAL_PAYMENT_ACCOUNT_UPI_DETAILS,
  VIRTUAL_PAYMENT_BANK_ACCOUNT_DETAILS,
} from './constants';
import {
  PaymentController,
  PaymentEmailController,
  PaymentNotificationController,
  OrderPaymentDetailsController,
} from './controllers';
import {
  FabricOrderPaymentDetailsRepository,
  OrgRazorpayCustomersRepository,
  VirtualPaymentAccountDetailsRepository,
  VirtualPaymentAccountUpiDetailsRepository,
  VirtualPaymentBankAccountDetailsRepository,
  OrderPaymentDetailsRepository,
} from './repositories/databases';
import {
  PaymentEmailService,
  PaymentService,
  OrderPaymentDetailsService,
} from './services';

@Module({
  imports: [OrderModule, forwardRef(() => CommonModule)],
  controllers: [
    PaymentController,
    PaymentEmailController,
    PaymentNotificationController,
    OrderPaymentDetailsController,
  ],
  providers: [
    PaymentService,
    PaymentEmailService,
    //PaymentNotificationService,
    OrderPaymentDetailsService,
    {
      provide: FABRIC_ORDER_PAYMENT_DETAILS_REPOSITORY,
      useClass: FabricOrderPaymentDetailsRepository,
    },
    {
      provide: ORG_RAZORPAY_CUSTOMERS,
      useClass: OrgRazorpayCustomersRepository,
    },
    {
      provide: VIRTUAL_PAYMENT_ACCOUNT_DETAILS,
      useClass: VirtualPaymentAccountDetailsRepository,
    },
    {
      provide: VIRTUAL_PAYMENT_BANK_ACCOUNT_DETAILS,
      useClass: VirtualPaymentBankAccountDetailsRepository,
    },
    {
      provide: VIRTUAL_PAYMENT_ACCOUNT_UPI_DETAILS,
      useClass: VirtualPaymentAccountUpiDetailsRepository,
    },
    {
      provide: ORDER_PAYMENT_DETAILS_REPOSITORY,
      useClass: OrderPaymentDetailsRepository,
    },
  ],
})
export class PaymentModule {}
