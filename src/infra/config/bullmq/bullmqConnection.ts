import { Queue, Worker, QueueEvents } from "bullmq";
import IORedis from "ioredis";
import { redisConfig } from "../redis";

export const connection = new IORedis(redisConfig);

export { Queue, Worker, QueueEvents };
