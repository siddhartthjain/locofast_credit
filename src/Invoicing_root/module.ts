import { Module } from '@nestjs/common';
import { CreditRootService } from './service/InvoicingRootService';
import { CreditRootController } from './controller/InvoicingRootController';

import { CREDIT_CUSTOMER_DETAILS_REPOSITORY } from './constants';

import { CommonModule } from '@app/_common';
import { CoreModule } from '@libs/core';

@Module({
  imports: [CommonModule, CoreModule],
  providers: [CreditRootService],
  controllers: [CreditRootController],
})
export class CreditCustomerModule {}
