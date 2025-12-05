import { Queue, Worker, QueueEvents } from "bullmq";
import { RedisClient } from "@/infra/redis/RedisClient";

export class BullMQProvider {
    private static queues: Record<string, Queue> = {};
    private static events: Record<string, QueueEvents> = {};
    private static workers: Record<string, Worker> = {};

    static getQueue(name: string): Queue {
        if (!this.queues[name]) {
            this.queues[name] = new Queue(name, {
                connection: RedisClient.get(),
            });
        }
        return this.queues[name];
    }

    static getQueueEvents(name: string): QueueEvents {
        if (!this.events[name]) {
            this.events[name] = new QueueEvents(name, {
                connection: RedisClient.get(),
            });
        }
        return this.events[name];
    }

    static createWorker(name: string, processor: any): Worker {
        if (!this.workers[name]) {
            this.workers[name] = new Worker(name, processor, {
                connection: RedisClient.get(),
            });
        }
        return this.workers[name];
    }
}
