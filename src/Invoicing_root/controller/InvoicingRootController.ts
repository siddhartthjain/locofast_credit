import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response, RestController } from '@libs/core';
import { InvoicingRootService } from '../service/InvoicingRootService';
import { FINANCE_MANAGER, LOCO_ADMIN } from '@app/auth/constants';
import { Roles } from '@app/auth';


@Controller('InvoicingRoot')
export class InvoicingRootController extends RestController{
  constructor(private InvoicingCustomerService: InvoicingRootService) {
    super()
  }


 @Post('/create')
 @Roles(FINANCE_MANAGER)
  async createRoot(
    @Req() req :Request,
    @Res() res :Response
  ):Promise<Response>
  {
    const inputs = req.all();
    const user = req.user;
    const data =await this.InvoicingCustomerService.createInvoicingRoot(inputs, user);
    return res.success(data);
  }


  @Get()
  @Roles(LOCO_ADMIN, FINANCE_MANAGER)
  async getInvoicinguser(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const inputs = req.all();
    const user = req.user;

    return this.InvoicingCustomerService.get(inputs, user);
  }
  
}
