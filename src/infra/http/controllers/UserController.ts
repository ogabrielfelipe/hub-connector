import { type FastifyRequest, type FastifyReply } from "fastify";
import { CreateUserUseCase } from "../../../core/application/user/use-case/CreateUseCase";
import type { IUserRepository } from "../../../core/domain/user/repositories/IUserRepository";
import { BullEventBus } from "../../event-bus/BullEventBus";
import { CreateUserSchema, UpdateUserSchema } from "../schemas/userSchemas";
import { ILogger } from "@/core/application/ports/logger.port";
import { UpdateUserUseCase } from "@/core/application/user/use-case/UpdateUseCase";
import { IPasswordHasher } from "@/core/application/user/interfaces/security/IPasswordHasher";

export class UserController {
  private createUserUseCase: CreateUserUseCase;
  private updateUserUseCase: UpdateUserUseCase;

  constructor(
    userRepository: IUserRepository,
    eventBus: BullEventBus,
    logger: ILogger,
    hasher: IPasswordHasher,
  ) {
    this.createUserUseCase = new CreateUserUseCase(
      userRepository,
      eventBus,
      logger,
      hasher,
    );
    this.updateUserUseCase = new UpdateUserUseCase(
      userRepository,
      logger,
      hasher,
    );
  }

  public async createUser(req: FastifyRequest, reply: FastifyReply) {
    const body = CreateUserSchema.parse(req.body);

    const result = await this.createUserUseCase.execute({
      email: body.email,
      name: body.name,
      username: body.username,
      role: body.role,
      password: body.password,
    });
    return reply.status(201).send({ userId: result });
  }

  public async updateUser(req: FastifyRequest, reply: FastifyReply) {
    const userId = (req.params as { id: string }).id;
    if (!userId) {
      return reply.status(400).send({ error: "User ID is required in params" });
    }
    const body = UpdateUserSchema.parse(req.body);

    const result = await this.updateUserUseCase.execute(userId, body);
    return reply
      .status(200)
      .send({
        id: result.getId(),
        name: result.getName(),
        email: result.getEmail(),
        username: result.getUsername(),
        role: result.getRole(),
      });
  }
}

