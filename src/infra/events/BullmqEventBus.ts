import { Job } from "bullmq";
import { getQueue } from "../config/bullmq/queue";
import { DomainEvent } from "./eventsTypes";
import { EventBus } from "./eventBus";

export class BullMQEventBus implements EventBus {
  async publish(event: DomainEvent): Promise<Job | void> {
    console.log("Publishing event to queue", event);
    const queue = getQueue("user-events");
    return await queue.add(event.type, event, {
      removeOnComplete: true,
      removeOnFail: false,
      attempts: 3,
    });
  }
}

export const eventBus = new BullMQEventBus();
