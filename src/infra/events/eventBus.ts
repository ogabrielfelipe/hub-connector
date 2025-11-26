import { Job } from "bullmq";
import { DomainEvent } from "./eventsTypes";

export interface EventBus {
  publish(event: DomainEvent): Promise<Job | void>;
}
