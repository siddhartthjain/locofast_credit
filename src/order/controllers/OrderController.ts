import { Request, Response } from '@libs/core';
import { Controller, Post, Req, Res, Patch, Get } from '@nestjs/common';
import { OrderService } from '../services';

@Controller('orders')
export class OrderController {
  constructor(private orderServcie: OrderService) {}

  @Get()
  async getOrder(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const inputs = req.all();
    const data = await this.orderServcie.getOrders(inputs);
    return res.success(data);
  }

  @Get('/active-orders')
  async getActiveOrders(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.orderServcie.getActiveOrders();
    return res.success(data);
  }

  @Get(':orderId')
  async getOrderDetails(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const inputs = req.all();
    const data = await this.orderServcie.getOrderDetails(inputs);
    return res.success(data);
  }

  @Patch(':orderId/confirm-order')
  async raisePO(@Req() req: Request, @Res() res: Response): Promise<Response> {
    // May be we will have performa invoice here too
    const inputs = req.all();
    await this.orderServcie.confirmOrder(inputs);
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
