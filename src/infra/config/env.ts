import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  //REDIS
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.coerce.number().default(6380),
  REDIS_URL: z.string(),

  //MONGODB
  MONGO_URI: z.string().default("mongodb://localhost:27018/hubDB"),

// AUTHENTICATION KEYS
  PUBLIC_KEY: z.string(),
  PRIVATE_KEY: z.string(),
});

export const env = envSchema.parse(process.env);

