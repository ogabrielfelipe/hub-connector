import { type FastifyRequest, type FastifyReply } from "fastify";
import { CreateUserUseCase } from "../../../core/application/user/use-case/CreateUseCase";
import type { IUserRepository } from "../../../core/domain/user/repositories/IUserRepository";
import {
  CreateUserSchema,
  FindAllUsersSchema,
  UpdateUserSchema,
} from "../schemas/userSchemas";
import { ILogger } from "@/core/application/ports/logger.port";
import { UpdateUserUseCase } from "@/core/application/user/use-case/UpdateUseCase";
import { IPasswordHasher } from "@/core/application/user/interfaces/security/IPasswordHasher";
import { CaslAbilityFactory } from "@/core/application/security/casl.factory";
import { FindOneUserUseCase } from "@/core/application/user/use-case/FindOneUserUseCase";
import { FindAllUsersUseCase } from "@/core/application/user/use-case/FindAllUsersUseCase";
import { DeleteUserUseCase } from "@/core/application/user/use-case/DeleteUserUseCase";

export class UserController {
  private createUserUseCase: CreateUserUseCase;
  private updateUserUseCase: UpdateUserUseCase;
  private findOneUserUseCase: FindOneUserUseCase;
  private findAllUserUseCase: FindAllUsersUseCase;
  private deleteUserUseCase: DeleteUserUseCase;

  constructor(
    userRepository: IUserRepository,
    logger: ILogger,
    hasher: IPasswordHasher,
    caslFactory: CaslAbilityFactory,
  ) {
    this.createUserUseCase = new CreateUserUseCase(
      userRepository,
      logger,
      hasher,
      caslFactory,
    );
    this.updateUserUseCase = new UpdateUserUseCase(
      userRepository,
      logger,
      hasher,
      caslFactory,
    );

    this.findOneUserUseCase = new FindOneUserUseCase(
      userRepository,
      caslFactory,
      logger,
    );
    this.findAllUserUseCase = new FindAllUsersUseCase(userRepository);
    this.deleteUserUseCase = new DeleteUserUseCase(
      userRepository,
      caslFactory,
      logger,
    );
  }

  public async createUser(req: FastifyRequest, reply: FastifyReply) {
    const body = CreateUserSchema.parse(req.body);
    const currentUser = req.user;

    const result = await this.createUserUseCase.execute(currentUser!.userId, {
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
    const currentUser = req.user;

    const result = await this.updateUserUseCase.execute(
      userId,
      body,
      currentUser!.userId,
    );
    return reply.status(200).send({
      id: result.getId(),
      name: result.getName(),
      email: result.getEmail(),
      username: result.getUsername(),
      role: result.getRole(),
    });
  }

  public async getUser(req: FastifyRequest, reply: FastifyReply) {
    const userId = (req.params as { id: string }).id;
    if (!userId) {
      return reply.status(400).send({ error: "User ID is required in params" });
    }
    const currentUser = req.user;

    const result = await this.findOneUserUseCase.execute(
      userId,
      currentUser!.userId,
    );
    return reply.status(200).send({
      id: result.getId(),
      name: result.getName(),
      email: result.getEmail(),
      username: result.getUsername(),
      role: result.getRole(),
    });
  }

  public async getUsers(req: FastifyRequest, reply: FastifyReply) {
    const query = FindAllUsersSchema.parse(req.query);

    const filters: {
      filters: { name?: string; username?: string; role?: string };
      page: number;
      limit: number;
    } = {
      filters: {},
      page: query.page,
      limit: query.limit,
    };

    if (query.name) {
      filters.filters.name = query.name;
    }
    if (query.username) {
      filters.filters.username = query.username;
    }
    if (query.role) {
      filters.filters.role = query.role;
    }

    const result = await this.findAllUserUseCase.execute(filters);
    return reply.status(200).send({
      docs: result.docs,
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  }

  public async deleteUser(req: FastifyRequest, reply: FastifyReply) {
    const userId = (req.params as { id: string }).id;
    if (!userId) {
      return reply.status(400).send({ error: "User ID is required in params" });
    }
    const currentUser = req.user;

    await this.deleteUserUseCase.execute(userId, currentUser!.userId);
    return reply.status(204).send();
  }
}
