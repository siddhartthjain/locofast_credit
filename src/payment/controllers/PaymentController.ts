import { RestController, Request, Response } from '@libs/core';
import { Controller, Req, Res, Get } from '@nestjs/common';
import { PaymentService } from '../services';

@Controller('payment')
export class PaymentController extends RestController {
  constructor(private paymentService: PaymentService) {
    super();
  }

  @Get('/get-vpa-details')
  async getCustomersDetails(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const inputs = req.all();
    const customersDetails = await this.paymentService.getVpaDetails(inputs);
    return res.success(customersDetails);
  }
}
