import { Controller, Res, Req, Post } from '@nestjs/common';
import { Request, Response } from '@libs/core';
import { ProvisionalOrderService } from '../services/ProvisionalOrderService';

@Controller('orders/provisional')
export class ProvisionalOrderController {
  constructor(private provisionalOrderService: ProvisionalOrderService) {}
  @Post('')
  async createProvisionalOrder(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const inputs = req.all();
    // will have user here too
    const order = await this.provisionalOrderService.createProvisionalOrder(
      inputs,
    );
    return res.noContent();
  }
}
