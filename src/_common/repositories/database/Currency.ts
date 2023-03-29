import { Currency } from '../../models';
import { Injectable } from '@nestjs/common';
import { DatabaseRepository as DB, InjectModel } from '@libs/core';
import { CurrencyContract } from '../contracts';

@Injectable()
export class CurrencyRepository extends DB implements CurrencyContract {
  @InjectModel(Currency)
  model: Currency;
}
