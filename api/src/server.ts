/* eslint-disable @typescript-eslint/no-explicit-any */
import fastify from "fastify";
import cors from "@fastify/cors";
import { connectMongo } from "./infra/config/mongoConnection";
import { usersRoutes } from "./infra/http/routes/UserRoutes";
import { DomainError } from "./core/domain/errors/DomainError";

import { FastifyAdapter } from "@bull-board/fastify";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { getQueue } from "./infra/config/bullmq/queue";
import { authRoutes } from "./infra/http/routes/AuthRoutes";
import fs from "fs";

import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import { WinstonLoggerService } from "./infra/logger/winston-logger.service";
import { NotPermissionError } from "./core/application/errors/NotPermissionError";
import { gatewayRoutes } from "./infra/http/routes/GatewayRoutes";
import { mongoDb } from "./infra/database";
import { routingRoutes } from "./infra/http/routes/RoutingRoutes";
import { configRoutes } from "./infra/http/routes/ConfigRoutes";
import { runMigrations } from "./infra/database/migrations";
import { IGatewayRepository } from "./core/domain/gateway/repositories/IGatewayRepository";
import { IRoutingRepository } from "./core/domain/routing/repositories/IRoutingRepository";
import { MongoGatewayRepository } from "./infra/database/repositories/MongoGatewayRepository";
import { MongoRoutingRepository } from "./infra/database/repositories/MongoRoutingRepository";

const logger = new WinstonLoggerService();

export async function buildServer({
  gatewayRepository,
  routingRepository,
}: {
  gatewayRepository?: IGatewayRepository;
  routingRepository?: IRoutingRepository;
}) {
  await connectMongo();

  if (process.env.NODE_ENV !== "production") {
    await runMigrations();
  }

  const app = fastify({
    logger: false,
  });

  await app.register(cors, {
    origin: "*",
    credentials: false,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
    ],
  });


  const gatewayRepo = gatewayRepository ?? new MongoGatewayRepository();
  const routingRepo =
    routingRepository ?? new MongoRoutingRepository(gatewayRepo);

  app.decorate("db", mongoDb);

  app.decorate("gatewayRepository", gatewayRepo);
  app.decorate("routingRepository", routingRepo);

  app.setErrorHandler((error, _req, reply) => {
    console.log(error);

    if (error instanceof NotPermissionError) {
      return reply.status(error.statusCode).send({
        message: error.message,
        timestamp: error.timestamp,
      });
    }

    // Erros do domínio → 4xx custom
    if (error instanceof DomainError) {
      return reply.status(error.statusCode).send({
        message: error.message,
        timestamp: error.timestamp,
      });
    }

    // Erros de validação Fastify/Zod/etc → 400
    if ((error as any).validation) {
      logger.warn(`Validation error: ${(error as any).message}`, { error });
      return reply.status(400).send({
        error: (error as any).message,
      });
    }

    // Logar apenas em dev (opcional)
    logger.error(`Unexpected error: ${(error as Error).message}`, { error });

    if (error instanceof Error) {
      switch (error.message) {
        case "Invalid credentials":
          return reply.status(401).send({
            message: error.message,
          });
        default:
          return reply.status(500).send({
            message: error.message,
          });
      }
    }

    // Erro não previsto → 500
    reply.status(500).send({ error: "Internal server error" });
  });

  const serverAdapter = new FastifyAdapter();

  createBullBoard({
    queues: [new BullMQAdapter(getQueue("domain-events"))],
    serverAdapter,
  });

  // Registra o plugin do painel BullMQ no Fastify
  serverAdapter.setBasePath("/ui");
  app.register(serverAdapter.registerPlugin(), { prefix: "/ui" });

  // Habilita Zod para o Fastify
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Swagger
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Hub Connector API",
        version: "1.0.0",
      },
    },
    transform: jsonSchemaTransform,
  });

  app.register(usersRoutes, { prefix: "/users" });
  app.register(authRoutes, { prefix: "/auth" });
  app.register(gatewayRoutes, { prefix: "/gateways" });
  app.register(routingRoutes, { prefix: "/routings" });
  app.register(configRoutes, { prefix: "/config" });

  app.register(fastifySwaggerUI, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
  });

  await app.ready();

  const swaggerObject = app.swagger();
  fs.writeFileSync(
    "./swagger.json",
    JSON.stringify(swaggerObject, null, 2),
    "utf-8",
  );

  try {
    return app;
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

export async function startHttpServer() {
  const app = await buildServer({});

  await app.listen({ port: 3333, host: "0.0.0.0" });
  console.log("Server is running on http://0.0.0.0:3333");
}
