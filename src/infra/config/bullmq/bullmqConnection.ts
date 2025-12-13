import { Queue, Worker, QueueEvents } from "bullmq";
import IORedis, { RedisOptions } from "ioredis";
import { env } from "../env";

export const redisConfig: RedisOptions = {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    db: Number(env.REDIS_PORT_BULLMQ),
};


export const connection = new IORedis(redisConfig);

export { Queue, Worker, QueueEvents };
