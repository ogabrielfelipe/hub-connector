import type { RedisOptions } from "ioredis";
import { env } from "./env";

export const redisConfig: RedisOptions = {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
};
