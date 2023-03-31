import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from '@libs/core';
import { InvoicingRootService } from '../service/InvoicingRootService';

@Controller('InvoicingRoot')
export class InvoicingRootController {
  constructor(private InvoicingCustomerService: InvoicingRootService) {}


 @Post('/create')
  async createRoot(
    @Req() req :Request,
    @Res() res :Response
  ):Promise<any>
  {
    const inputs = req.all();
    const user = req.user;
    return await this.InvoicingCustomerService.createInvoicingRoot(inputs, user);
  }


  @Get()
  async getInvoicinguser(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const inputs = req.all();
    const user = req.user;

    return this.InvoicingCustomerService.get(inputs, user);
  }
}
