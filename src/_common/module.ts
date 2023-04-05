import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  INVOICING_ROOT_REPO,
  INVOICING_USER_REPO,
  CURRENCY_REPOSITORY,
  LF_ROOT_REPOSITORY,
  USER_REPOSITORY,
  CREDIT_INFO_REPO,
} from './constants';
import { CommonController } from './controllers';
import {
  CurrencyRepository,
  LfRootRepository,
  UserRepository,
} from './repositories';
import { CreditInfoRepo } from './repositories/database/CreditInfo';
import { InvoicingRootRepository } from './repositories/database/InvoicingRoot';
import { InvoicingUserRepository } from './repositories/database/Users';
import { CurrencyService, LfRootService, UserService } from './services';
import { CommonService } from './services/Commonservice';

@Module({
  controllers: [CommonController,],
  imports: [ HttpModule,],
  providers: [
    UserService,
    LfRootService,
    CurrencyService,
    ConfigService,
    
    CommonService,
    { provide: USER_REPOSITORY, useClass: UserRepository },
    { provide: LF_ROOT_REPOSITORY, useClass: LfRootRepository },
    { provide: CURRENCY_REPOSITORY, useClass: CurrencyRepository },
    {
      provide: INVOICING_ROOT_REPO,
      useClass: InvoicingRootRepository,
    },
    {
      provide: INVOICING_USER_REPO,
      useClass: InvoicingUserRepository,
    },
    {
      provide: CREDIT_INFO_REPO,
      useClass: CreditInfoRepo,
    },
  ],
  exports: [
    UserService,
    LfRootService,
    CurrencyService,
    ConfigService,
    
    CommonService,
    { provide: USER_REPOSITORY, useClass: UserRepository },
    { provide: LF_ROOT_REPOSITORY, useClass: LfRootRepository },
    { provide: CURRENCY_REPOSITORY, useClass: CurrencyRepository },
    {
      provide: INVOICING_ROOT_REPO,
      useClass: InvoicingRootRepository,
    },
    {
      provide: INVOICING_USER_REPO,
      useClass: InvoicingUserRepository,
    },
    {
      provide: CREDIT_INFO_REPO,
      useClass: CreditInfoRepo,
    },
  ],
})
export class CommonModule {}
