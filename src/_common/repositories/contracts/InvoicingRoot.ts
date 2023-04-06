import { RepositoryContract } from '@libs/core';

export interface InvoicingRootContract extends RepositoryContract {
  getCreditInfo(id): Promise<Array<Record<string, any>>>;
  searchSuppliers(
    inputs: Record<string, any>,
  ): Promise<Array<Record<string, any>>>;
}
