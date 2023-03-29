import { Injectable, Inject } from '@nestjs/common';
import { CurrencyContract } from '../repositories';
import { CURRENCY_REPOSITORY } from '../constants';

@Injectable()
export class CurrencyService {
  constructor(
    @Inject(CURRENCY_REPOSITORY) private currency: CurrencyContract,
  ) {}

  async findByCode(code: string): Promise<Record<string, any>> {
    return this.currency.firstWhere({ code });
  }
}
