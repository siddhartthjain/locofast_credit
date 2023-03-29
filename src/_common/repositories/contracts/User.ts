import { RepositoryContract } from '@libs/core';

export interface UserContract extends RepositoryContract {
  getWelcomeMessageUserDetails(
    userIds: number[],
  ): Promise<Record<string, any>[]>;
  getUserDetailsByOrgIdsForWhatsapp(
    orgIds: number[],
  ): Promise<Record<string, any>[]>;
  getAssignedAccountManager(orgId: number): Promise<Record<string, any>>;
}
