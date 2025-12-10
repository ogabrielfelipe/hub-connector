import { DomainEvent } from "@/core/domain/routing/AggregateRoot";

export class RoutingExecutionCreated implements DomainEvent {
  readonly occurredAt: Date = new Date();

  constructor(
    public readonly routingExecutionId: string,
    public readonly routingId: string,
    public readonly payload: unknown,
  ) { }
}
