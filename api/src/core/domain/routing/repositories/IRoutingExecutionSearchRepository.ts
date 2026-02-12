/* eslint-disable @typescript-eslint/no-explicit-any */

export interface RoutingExecutionSearchParams {
  routingId?: string;
  id?: string;
  status?: string;
  text?: string;
  from?: Date;
  to?: Date;
  page: number;
  perPage: number;
}

export interface RoutingExecutionSearchResult<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
}

export interface IRoutingExecutionSearchRepository {
  search(
    params: RoutingExecutionSearchParams,
  ): Promise<RoutingExecutionSearchResult<any>>;
}
