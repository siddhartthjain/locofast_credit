import { RestController, Request, Response } from '@libs/core';
import { Controller, Req, Res, Get } from '@nestjs/common';
//import { PaymentNotificationService } from '../services';

@Controller('payments/notification')
export class PaymentNotificationController extends RestController {
  constructor(/*private paymentNotificationService: PaymentNotificationService*/) {
    super();
  }

  /* @Get('/pg/order')
  async getPaymentGatewayOrderNotificationDetails(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const inputs = req.all();
    const pgPaymentOrderDetails =
      await this.paymentNotificationService.getPaymentGatewayOrderNotificationDetails(
        inputs,
      );
    return res.success(pgPaymentOrderDetails);
  }

  @Get('/vpa/order')
  async getVPAOrderNotificationDetails(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const inputs = req.all();
    const vpaPaymentOrderDetails =
      await this.paymentNotificationService.getVPAOrderNotificationDetails(
        inputs,
      );
    return res.success(vpaPaymentOrderDetails);
  }*/
}
