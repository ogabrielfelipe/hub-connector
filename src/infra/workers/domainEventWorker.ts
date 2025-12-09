import { Worker } from "bullmq";
import { handleDomainEvent } from "../events/eventDispatcher";

export const domainEventWorker = new Worker(
  "domain-events",
  async job => {
    const { eventName, payload } = job.data;

    console.log("[EVENT RECEIVED]:", eventName);

    await handleDomainEvent(eventName, payload);
  },
  { connection: { host: "localhost", port: 6380 } }
);
