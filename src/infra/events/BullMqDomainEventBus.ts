import { DomainEvent } from "@/core/domain/routing/AggregateRoot";
import { Queue } from "bullmq";

export class BullMqDomainEventBus {
  constructor(private readonly queue: Queue) {}

  async publish(events: DomainEvent[]) {
    for (const event of events) {
      await this.queue.add(event.constructor.name, {
        eventName: event.constructor.name,
        payload: event,
        occurredAt: event.occurredAt,
      });
    }
  }
}
