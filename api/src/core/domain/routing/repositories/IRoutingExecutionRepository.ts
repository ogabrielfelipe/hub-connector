import { RoutingExecution } from "../entities/RoutingEcxecution";

export interface IRoutingExecutionRepository {
  save(routingExecution: RoutingExecution): Promise<RoutingExecution>;
  update(routingExecution: RoutingExecution): Promise<RoutingExecution>;
  findById(id: string): Promise<RoutingExecution | null>;
  findAllByRoutingId({
    routingId,
    page,
    limit,
  }: {
    routingId: string;
    page?: number;
    limit?: number;
  }): Promise<{
    docs: RoutingExecution[];
    total: number;
    page: number;
    limit: number;
  }>;
}
