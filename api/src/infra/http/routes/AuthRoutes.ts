import type { FastifyInstance } from "fastify";
import { MongoUserRepository } from "../../database/repositories/MongoUserRepository";
import { AuthController } from "../controllers/AuthController";
import { BcryptHasher } from "@/infra/security/BcryptHasher";
import { JWTService } from "@/infra/security/JWTService";
import {
  LoginResponseSchema,
  LoginSchema,
  MeResponseSchema,
} from "../schemas/authSchemas";
import { authMiddleware } from "../middlewares/authMiddleware";

export async function authRoutes(app: FastifyInstance) {
  const userRepository = new MongoUserRepository();
  const hasher = new BcryptHasher();
  const token = new JWTService();

  const userController = new AuthController(userRepository, hasher, token, app);

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

  app.get(
    "/github",
    {
      schema: {
        tags: ["Auth"],
        summary: "GitHub login",
        description: "Endpoint for GitHub authentication.",
      },
    },
    (req, reply) => userController.githubLogin(req, reply),
  );

  app.post(
    "/github/callback",
    {
      schema: {
        tags: ["Auth"],
        summary: "GitHub callback",
        description: "Endpoint for GitHub authentication callback.",
      },
    },
    (req, reply) => userController.githubCallback(req, reply),
  );

  app.get(
    "/me",
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ["Auth"],
        response: { 200: MeResponseSchema },
        summary: "Get current user",
        description:
          "Endpoint to get the current authenticated user's information.",
      },
    },
    (req, reply) => userController.me(req, reply),
  );
}
