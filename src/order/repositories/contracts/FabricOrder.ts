import { GetOrders } from '@app/order/interfaces';
import { RepositoryContract } from '@libs/core';

export interface FabricOrderContract extends RepositoryContract {
  getOrders(inputs: GetOrders): Promise<Record<string, any>>;
  getActiveOrders(inputs: Record<string, any>): Promise<Record<string, any>>;
}
