import type { FastifyInstance } from "fastify";
import { MongoUserRepository } from "../../database/mongo/repositories/MongoUserRepository";
import { AuthController } from "../controllers/AuthController";
import { BcryptHasher } from "@/infra/security/BcryptHasher";
import { JWTService } from "@/infra/security/JWTService";
import { LoginResponseSchema, LoginSchema } from "../schemas/authSchemas";

export async function authRoutes(app: FastifyInstance) {
  const userRepository = new MongoUserRepository();
  const hasher = new BcryptHasher();
  const token = new JWTService();

  const userController = new AuthController(userRepository, hasher, token);

  app.post(
    "/login",
    {
      schema: {
        body: LoginSchema,
        response: { 200: LoginResponseSchema },
        tags: ["Auth"],
        summary: "User login",
        description: "Endpoint for user authentication and token generation.",
      },
    },
    (req, reply) => userController.loginUser(req, reply),
  );
}
