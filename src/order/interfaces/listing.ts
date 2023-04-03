export interface GetOrders {
  orderTab: string;
  limit?: number;
  pageNo?: number;
  sortOrder?: string;
  user?: {
    role: string;
    orgId?: number;
  };
}
