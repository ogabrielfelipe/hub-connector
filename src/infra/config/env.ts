import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  //REDIS
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),
  REDIS_URL: z.string(),

  //REDIS CACHE
  REDIS_PORT_BULLMQ: z.coerce.number(),
  REDIS_PORT_CACHE: z.coerce.number(),

  //MONGODB
  MONGO_URI: z.string(),

  // AUTHENTICATION KEYS
  PUBLIC_KEY: z.string(),
  PRIVATE_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
