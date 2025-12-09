import { DomainEvent } from "@/shared/domain/AggregateRoot";



export class RoutingExecutionCreated implements DomainEvent {
    readonly occurredAt: Date = new Date();

    constructor(
        public readonly routingExecutionId: string,
        public readonly routingId: string,
        public readonly payload: unknown,
    ) { }
}