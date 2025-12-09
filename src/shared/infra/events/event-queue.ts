import { Queue } from "bullmq";
import { BullMqDomainEventBus } from "./BullMqDomainEventBus";

export const domainEventsQueue = new Queue("domain-events", {
  connection: { host: "localhost", port: 6380 },
});

export const domainEventBus = new BullMqDomainEventBus(domainEventsQueue);
