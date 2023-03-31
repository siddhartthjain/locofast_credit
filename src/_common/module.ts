import { Module } from '@nestjs/common';
import {
 INVOICING_ROOT_REPO,
 INVOICING_USER_REPO,
  CURRENCY_REPOSITORY,
  LF_ROOT_REPOSITORY,
  USER_REPOSITORY,
} from './constants';
import { CommonController } from './controllers';
import {
  CurrencyRepository,
  LfRootRepository,
  UserRepository,
} from './repositories';
import { InvoicingRootRepository } from './repositories/database/InvoicingRoot';
import { InvoicingUserRepository } from './repositories/database/Users';
import { CurrencyService, LfRootService, UserService } from './services';

@Module({
  controllers: [CommonController],
  imports: [],
  providers: [
    UserService,
    LfRootService,
    CurrencyService,
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
  ],
  exports: [
    UserService,
    LfRootService,
    CurrencyService,
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
  ],
})
export class CommonModule {}
