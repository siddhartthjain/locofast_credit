import { Inject, Injectable } from '@nestjs/common';
import { INVOICING_USER_REPO } from '../constants';
import { InvoicingUserContract } from '../repositories';

@Injectable()
export class InvoicingUserService {
  constructor(
    @Inject(INVOICING_USER_REPO) private invoicinguser: InvoicingUserContract,
  ) {}

  async getbyId(id: number) {
    return this.invoicinguser.firstWhere({ id });
  }
}
