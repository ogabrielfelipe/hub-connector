import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import cors from "@fastify/cors";
import { mongoDb } from "../../../database";

export const registerCors = fp(
  async (app: FastifyInstance) => {
    await app.register(cors, {
      origin: process.env.FRONTEND_URL ?? "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Accept",
        "Origin",
        "x-api-key",
      ],
      credentials: true,
    });

    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
    app.decorate("db", mongoDb);
  },
  {
    name: "core-plugin",
  },
);
