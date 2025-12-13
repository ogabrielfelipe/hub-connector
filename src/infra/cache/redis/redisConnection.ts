import { env } from "@/infra/config/env";
import IORedis from "ioredis";

export const redis = new IORedis({
  host: env.REDIS_HOST,
  port: Number(env.REDIS_PORT),
  db: Number(env.REDIS_PORT_CACHE),
});
