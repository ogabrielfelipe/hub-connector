import { Queue } from "bullmq";
import { BullMqDomainEventBus } from "./BullMqDomainEventBus";
import { connection } from "../config/bullmq/bullmqConnection";

export const domainEventsQueue = new Queue("domain-events", {
  connection,
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
