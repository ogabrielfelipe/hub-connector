import type { FastifyInstance } from "fastify";
import { UserController } from "../controllers/UserController";
import { MongoUserRepository } from "../../database/mongo/repositories/MongoUserRepository";
import { UserQueueProducer } from "../../event-bus/UserQueueProduces";
import { BullEventBus } from "../../event-bus/BullEventBus";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  CreateUserResponseSchema,
  CreateUserSchema,
} from "../schemas/userSchemas";
import { authorize } from "../middlewares/checkPermissionsMiddleware";

export async function usersRoutes(app: FastifyInstance) {
  const userRepository = new MongoUserRepository();
  const eventBus = new BullEventBus(new UserQueueProducer());

  const userController = new UserController(userRepository, eventBus);

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
}
