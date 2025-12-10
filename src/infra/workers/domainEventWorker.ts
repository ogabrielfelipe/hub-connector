import { Worker } from "bullmq";
import { handleDomainEvent } from "../events/eventDispatcher";
import { connection } from "../config/bullmq/bullmqConnection";

export const domainEventWorker = new Worker(
  "domain-events",
  async (job) => {
    const { eventName, payload } = job.data;

    await handleDomainEvent(eventName, payload);
  },
  { connection },
);
