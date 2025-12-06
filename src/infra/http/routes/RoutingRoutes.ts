import { CaslAbilityFactory } from "@/core/application/security/casl.factory";
import { MongoGatewayRepository } from "@/infra/database/repositories/MongoGatewayRepository";
import { MongoRoutingRepository } from "@/infra/database/repositories/MongoRoutingRepository";
import { MongoUserRepository } from "@/infra/database/repositories/MongoUserRepository";
import { WinstonLoggerService } from "@/infra/logger/winston-logger.service";
import { FastifyInstance } from "fastify";
import { RoutingController } from "../controllers/RoutingController";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  CreateRoutingResponseSchema,
  CreateRoutingSchema,
  FindAllRoutingResponseSchema,
  FindAllRoutingSchema,
  FindOneRoutingResponseSchema,
  FindOneRoutingSchema,
  UpdateRoutingResponseSchema,
  UpdateRoutingSchema,
} from "../schemas/routingSchemas";

export async function routingRoutes(app: FastifyInstance) {
  const gatewayRepository = new MongoGatewayRepository();
  const routingRepository = new MongoRoutingRepository(gatewayRepository);
  const userRepository = new MongoUserRepository();
  const logger = new WinstonLoggerService();
  const caslFactory = new CaslAbilityFactory();

  const routingController = new RoutingController(
    routingRepository,
    gatewayRepository,
    userRepository,
    caslFactory,
    logger,
  );

  app.post(
    "/",
    {
      preHandler: [authMiddleware],
      schema: {
        body: CreateRoutingSchema,
        response: { 201: CreateRoutingResponseSchema },
        tags: ["Routings"],
        summary: "Create a new routing",
        description: "Endpoint to create a new routing in the system.",
      },
    },
    (req, reply) => routingController.create(req, reply),
  );

  app.put(
    "/:routingId",
    {
      preHandler: [authMiddleware],
      schema: {
        params: FindOneRoutingSchema,
        body: UpdateRoutingSchema,
        response: { 200: UpdateRoutingResponseSchema },
        tags: ["Routings"],
        summary: "Update an existing routing",
        description: "Endpoint to update an existing routing in the system.",
      },
    },
    (req, reply) => routingController.update(req, reply),
  );

  app.delete(
    "/:routingId",
    {
      preHandler: [authMiddleware],
      schema: {
        params: FindOneRoutingSchema,
        response: { 204: {} },
        tags: ["Routings"],
        summary: "Delete an existing routing",
        description: "Endpoint to delete an existing routing in the system.",
      },
    },
    (req, reply) => routingController.delete(req, reply),
  );

  app.get(
    "/",
    {
      preHandler: [authMiddleware],
      schema: {
        querystring: FindAllRoutingSchema,
        response: { 200: FindAllRoutingResponseSchema },
        tags: ["Routings"],
        summary: "Find all routings",
        description: "Endpoint to find all routings in the system.",
      },
    },
    (req, reply) => routingController.findAll(req, reply),
  );

  app.get(
    "/:routingId",
    {
      preHandler: [authMiddleware],
      schema: {
        params: FindOneRoutingSchema,
        response: { 200: FindOneRoutingResponseSchema },
        tags: ["Routings"],
        summary: "Find a routing by id",
        description: "Endpoint to find a routing by id in the system.",
      },
    },
    (req, reply) => routingController.findOne(req, reply),
  );
}
