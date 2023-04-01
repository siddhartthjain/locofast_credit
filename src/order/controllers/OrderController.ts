import { Request, Response } from '@libs/core';
import { Controller, Post, Req, Res, Patch } from '@nestjs/common';
import { OrderService } from '../services';

@Controller('orders')
export class OrderController {
  constructor(private orderServcie: OrderService) {}

  @Patch(':orderId/raise-po')
  async raisePO(@Req() req: Request, @Res() res: Response): Promise<Response> {
    // May be we will have performa invoice here too
    const inputs = req.all();
    await this.orderServcie.raisePo(inputs);
    return res.noContent();
  }

  // need to handle file here
  @Post(':orderId/dispatch')
  async dispatchOrder(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const inputs = req.all();
    await this.orderServcie.dispatchOrder(inputs);
    return res.noContent();
  }

  @Post(':orderId/mark-delivered')
  async markOrderDelivered(@Req() req: Request, @Res() res: Response) {
    const inputs = req.all();
    await this.orderServcie.markOrderDelivered(inputs);
    return res.noContent();
  }
}
