import { Module } from '@nestjs/common';
import { CreditCustomerService } from './service/CreditCustomerService';
import { CreditCustomerController } from './controller/CreditCustomerController';
import { CommonModule } from 'src/common/module';
import { CREDIT_CUSTOMER_DETAILS_REPOSITORY } from './constants';
import { CoreModule } from 'src/core';

@Module({
  imports: [CommonModule, CoreModule],
  providers: [CreditCustomerService],
  controllers: [CreditCustomerController],
})
export class CreditCustomerModule {}
