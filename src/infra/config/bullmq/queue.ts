import { Queue, connection } from "./bullmqConnection";

const queues: Record<string, Queue> = {};

export function getQueue(name: string): Queue {
  if (!queues[name]) {
    queues[name] = new Queue(name, {
      connection,
    });
  }
  return queues[name];
}
