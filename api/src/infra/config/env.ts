import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  //SERVER
  PORT: z.coerce.number(),
  NODE_ENV: z.enum(["development", "production", "test"]),

  //REDIS
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),
  REDIS_URL: z.string(),

  //REDIS CACHE
  REDIS_PORT_BULLMQ: z.coerce.number(),
  REDIS_PORT_CACHE: z.coerce.number(),

  //MONGODB
  MONGO_URI: z.string(),

  // OPENSEARCH
  OPENSEARCH_URI: z.string(),

  // AUTHENTICATION KEYS
  PUBLIC_KEY: z.string(),
  PRIVATE_KEY: z.string(),

  // SWAGGER
  SWAGGER_USER: z.string(),
  SWAGGER_PASSWORD: z.string(),

  //SSO GitHub
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  GITHUB_CALLBACK_URL: z.string(),
  GITHUB_URL_GET_ACCESS_TOKEN: z.string(),
  GITHUB_URL_GET_USER: z.string(),
  GITHUB_URL_GET_USER_EMAILS: z.string(),

  //Frontend
  FRONTEND_URL: z.string(),
});

export const env = envSchema.parse(process.env);
