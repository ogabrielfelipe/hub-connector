/* eslint-disable @typescript-eslint/no-explicit-any */
import { DomainEvent } from "./AggregateRoot";

type DomainEventHandler<T extends DomainEvent> = (event: T) => Promise<void> | void;

export class DomainEventBus {
    private handlers: Map<string, DomainEventHandler<any>[]> = new Map();

    subscribe<T extends DomainEvent>(
        eventName: string,
        handler: DomainEventHandler<T>,
    ) {
        const existing = this.handlers.get(eventName) ?? [];
        this.handlers.set(eventName, [...existing, handler]);
    }

    async publish(events: DomainEvent[]) {
        for (const event of events) {
            const eventName = event.constructor.name;

            const handlers = this.handlers.get(eventName);
            if (!handlers) continue;

            for (const handler of handlers) {
                await handler(event);
            }
        }
    }
}

export const domainEventBus = new DomainEventBus();
