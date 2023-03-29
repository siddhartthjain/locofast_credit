import { Injectable, Inject } from '@nestjs/common';
import { ORG_RAZORPAY_CUSTOMERS } from '../constants';
import { OrgRazorpayCustomersContract } from '../repositories';

@Injectable()
export class PaymentEmailService {
  constructor(
    @Inject(ORG_RAZORPAY_CUSTOMERS)
    private orgRpzCustomers: OrgRazorpayCustomersContract,
  ) {}

  async getRazorpayCustomerDetails(
    inputs: Record<string, any>,
  ): Promise<Record<string, any>> {
    return this.orgRpzCustomers.getRazorpayCustomerDetails(inputs.razorpayCustomerId);
  }
}
