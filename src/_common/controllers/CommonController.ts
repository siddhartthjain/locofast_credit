import { Request, Response, RestController } from '@libs/core';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { CurrencyService } from '../services';

@Controller('common')
export class CommonController extends RestController {
  constructor(private currencyService: CurrencyService) {
    super();
  }

  @Get('currency')
  async getCurrencyDetails(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const inputs = req.all();

    const data = await this.currencyService.findByCode(inputs.code);

    return res.success(data);
  }
}
