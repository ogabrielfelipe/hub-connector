import type { FastifyInstance } from "fastify";
import { UserController } from "../controllers/UserController";
import { MongoUserRepository } from "../../database/mongo/repositories/MongoUserRepository";
import { UserQueueProducer } from "../../event-bus/UserQueueProduces";
import { BullEventBus } from "../../event-bus/BullEventBus";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  CreateUserResponseSchema,
  CreateUserSchema,
  UpdateUserResponseSchema,
} from "../schemas/userSchemas";
import { authorize } from "../middlewares/checkPermissionsMiddleware";
import { WinstonLoggerService } from "@/infra/logger/winston-logger.service";
import { BcryptHasher } from "@/infra/security/BcryptHasher";

export async function usersRoutes(app: FastifyInstance) {
  const userRepository = new MongoUserRepository();
  const eventBus = new BullEventBus(new UserQueueProducer());
  const logger = new WinstonLoggerService();
  const hasher = new BcryptHasher();

  const userController = new UserController(userRepository, eventBus, logger, hasher);

  app.post(
    "/",
    {
      preHandler: [authMiddleware, authorize("create", "User")],
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
      preHandler: [authMiddleware, authorize("update", "User")], // TODO: Não pode alterar um registro que não é do próprio usuário (Role: User, Dev)
      schema: {
        body: CreateUserSchema.partial(),
        response: { 200: UpdateUserResponseSchema },
        tags: ["Users"],
        summary: "Update an existing user",
        description: "Endpoint to update an existing user in the system.",
      },
    },
    (req, reply) => userController.updateUser(req, reply),
  );
}
