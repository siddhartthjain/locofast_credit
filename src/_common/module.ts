import { Module } from '@nestjs/common';
import {
  CREDIT_CUSTOMER_REPO,
  CREDIT_USER_REPO,
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
import { CreditCustomerRepository } from './repositories/database/CreditCustomer';
import { CreditUserRepository } from './repositories/database/CreditUsers';
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
  ],
  exports: [
    UserService,
    LfRootService,
    CurrencyService,
    { provide: USER_REPOSITORY, useClass: UserRepository },
    { provide: LF_ROOT_REPOSITORY, useClass: LfRootRepository },
    { provide: CURRENCY_REPOSITORY, useClass: CurrencyRepository },
    {
      provide: CREDIT_CUSTOMER_REPO,
      useClass: CreditCustomerRepository,
    },
    {
      provide: CREDIT_USER_REPO,
      useClass: CreditUserRepository,
    },
  ],
})
export class CommonModule {}
