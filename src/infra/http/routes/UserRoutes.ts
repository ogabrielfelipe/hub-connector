import type { FastifyInstance } from "fastify";
import { UserController } from "../controllers/UserController";
import { MongoUserRepository } from "../../database/mongo/repositories/MongoUserRepository";
import { UserQueueProducer } from "../../event-bus/UserQueueProduces";
import { BullEventBus } from "../../event-bus/BullEventBus";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  CreateUserResponseSchema,
  CreateUserSchema,
  FindAllUsersResponseSchema,
  FindAllUsersSchema,
  FindOneUserResponseSchema,
  FindOneUserSchema,
  UpdateUserResponseSchema,
  UpdateUserSchema,
} from "../schemas/userSchemas";
import { WinstonLoggerService } from "@/infra/logger/winston-logger.service";
import { BcryptHasher } from "@/infra/security/BcryptHasher";
import { CaslAbilityFactory } from "@/core/application/security/casl.factory";
import { Actions } from "@/core/application/security/casl.types";

export async function usersRoutes(app: FastifyInstance) {
  const userRepository = new MongoUserRepository();
  const eventBus = new BullEventBus(new UserQueueProducer());
  const logger = new WinstonLoggerService();
  const hasher = new BcryptHasher();
  const caslFactory = new CaslAbilityFactory();

  const userController = new UserController(userRepository, eventBus, logger, hasher, caslFactory);

  app.post(
    "/",
    {
      preHandler: [authMiddleware],
      schema: {
        body: CreateUserSchema,
        response: { 201: CreateUserResponseSchema },
        tags: ["Users"],
        summary: "Create a new user",
        description: "Endpoint to create a new user in the system.",
      },
    },
    (req, reply) => userController.createUser(req, reply),
  );

  app.put(
    "/:id",
    {
      preHandler: [authMiddleware],
      schema: {
        body: UpdateUserSchema,
        response: { 200: UpdateUserResponseSchema },
        tags: ["Users"],
        summary: "Update an existing user",
        description: "Endpoint to update an existing user in the system.",
      },
    },
    (req, reply) => userController.updateUser(req, reply),
  );

  app.get(
    "/",
    {
      preHandler: [authMiddleware],
      schema: {
        querystring: FindAllUsersSchema,
        response: { 200: FindAllUsersResponseSchema },
        tags: ["Users"],
        summary: "Get all users",
        description: "Endpoint to get all users in the system.",
      },
    },
    (req, reply) => userController.getUsers(req, reply),
  );

  app.get(
    "/:id",
    {
      preHandler: [authMiddleware],
      schema: {
        params: FindOneUserSchema,
        response: { 200: FindOneUserResponseSchema },
        tags: ["Users"],
        summary: "Get a user",
        description: "Endpoint to get a user in the system.",
      },
    },
    (req, reply) => userController.getUser(req, reply),
  );

  app.delete(
    "/:id",
    {
      preHandler: [authMiddleware],
      schema: {
        params: FindOneUserSchema,
        tags: ["Users"],
        summary: "Delete a user",
        description: "Endpoint to delete a user in the system.",
      },
    },
    (req, reply) => userController.deleteUser(req, reply),
  );
}
