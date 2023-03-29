import { RepositoryContract } from '@libs/core';

export interface OrderPaymentDetailsContract extends RepositoryContract {
  getOrderPaymentDetails(
    orderPaymentId: number,
    getOrgDetails: boolean,
    getOrgAccountManager: boolean,
  ): Promise<Record<string, any>>;
}
