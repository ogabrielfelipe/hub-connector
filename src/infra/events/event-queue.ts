import { Queue } from "bullmq";
import { BullMqDomainEventBus } from "./BullMqDomainEventBus";

export const domainEventsQueue = new Queue("domain-events", {
  connection: { host: "localhost", port: 6380 },
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: false,
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});

export const domainEventBus = new BullMqDomainEventBus(domainEventsQueue);
