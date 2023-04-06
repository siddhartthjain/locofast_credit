import { Controller, Post, Req, Res, Get } from '@nestjs/common';
import { Request, Response } from '@libs/core';
import { SupplierService } from '../services';

@Controller('supplier')
export class SupplierController {
  constructor(private supplierService: SupplierService) {}
  @Post('create')
  async createSupplier(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const inputs = req.all();
    await this.supplierService.addSupplier(inputs);
    return res.noContent();
  }

  @Get('/search')
  async searchSuppliers(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const inputs = req.all();
    const data = await this.supplierService.searchSuppliers(inputs);
    return res.success(data);
  }
}
