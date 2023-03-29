import { RepositoryContract } from '@libs/core';

export interface LfRootContract extends RepositoryContract {
  getOrgUserDetails(orgIds: Array<number>): Promise<Record<string, any>[]>;
  getOrgDetails(orgId: number): Promise<Record<string, any>>;
}
