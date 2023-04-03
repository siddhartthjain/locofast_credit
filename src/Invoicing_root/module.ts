import { Module } from '@nestjs/common';
import { InvoicingRootService } from './service/InvoicingRootService';
import { InvoicingRootController } from './controller/InvoicingRootController';

import { CREDIT_CUSTOMER_DETAILS_REPOSITORY } from './constants';

import { CommonModule } from '@app/_common';
import { CoreModule } from '@libs/core';

@Module({
  imports: [CommonModule, CoreModule],
  providers: [InvoicingRootService],
  controllers: [InvoicingRootController],
})
export class InvoicingRootModule {}
