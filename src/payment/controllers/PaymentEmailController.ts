import { RestController, Request, Response } from '@libs/core';
import { Controller, Req, Res, Get } from '@nestjs/common';
import { PaymentEmailService } from '../services';

@Controller('payment/email')
export class PaymentEmailController extends RestController {
  constructor(private paymentEmailService: PaymentEmailService) {
    super();
  }

  @Get('/razorpay/customer-details/:razorpayCustomerId')
  async getRazorpayCustomerDetails(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const inputs = req.all();
    const razorpayCustomerDetails =
      await this.paymentEmailService.getRazorpayCustomerDetails(inputs);
    return res.success(razorpayCustomerDetails);
  }
}
