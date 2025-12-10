import { RoutingExecution } from "@/core/domain/routing/entities/RoutingEcxecution";
import { IRoutingExecutionRepository } from "@/core/domain/routing/repositories/IRoutingExecutionRepository";
import { domainEventBus } from "@/infra/events/event-queue";

export class InMemoryRoutingExecutionRepository
  implements IRoutingExecutionRepository {
  private routingExecution: RoutingExecution[] = [];

  save(routingExecution: RoutingExecution): Promise<RoutingExecution> {
    const events = routingExecution.pullDomainEvents();
    domainEventBus.publish(events);

    this.routingExecution.push(routingExecution);
    return Promise.resolve(routingExecution);
  }
  update(routingExecution: RoutingExecution): Promise<RoutingExecution> {
    const index = this.routingExecution.findIndex(
      (item) => item.getId() === routingExecution.getId(),
    );
    if (index === -1) {
      throw new Error("Routing execution not found");
    }
    this.routingExecution[index] = routingExecution;
    const events = routingExecution.pullDomainEvents();
    domainEventBus.publish(events);
    return Promise.resolve(routingExecution);
  }
  findById(id: string): Promise<RoutingExecution | null> {
    return Promise.resolve(
      this.routingExecution.find((item) => item.getId() === id) || null,
    );
  }
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
  }> {
    const docs = this.routingExecution.filter(
      (item) => item.getRoutingId() === routingId,
    );
    return Promise.resolve({
      docs,
      total: docs.length,
      page: page || 1,
      limit: limit || 10,
    });
  }

  clear() {
    this.routingExecution = [];
  }
}
