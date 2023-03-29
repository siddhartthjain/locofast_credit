import { RepositoryContract } from '@libs/core';

export interface OrgRazorpayCustomersContract extends RepositoryContract {
  getOrgVpaDetails(orgId: number | string): Promise<Record<string, any>>;
  getRazorpayCustomerDetails(
    razorpayCustomerId: number | string,
  ): Promise<Record<string, any>>;
}
