import { RestController, Request, Response } from '@libs/core';
import { Controller, Req, Res, Get } from '@nestjs/common';
import { OrderPaymentDetailsService } from '../services';

@Controller('order-payment-details')
export class OrderPaymentDetailsController extends RestController {
  constructor(private orderPaymentDetailsService: OrderPaymentDetailsService) {
    super();
  }

  @Get('/:orderPaymentId')
  async getOrderPaymentDetails(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const inputs = req.all();
    const orderPaymentDetails =
      await this.orderPaymentDetailsService.getOrderPaymentDetails(inputs);
    return res.success(orderPaymentDetails);
  }
}
