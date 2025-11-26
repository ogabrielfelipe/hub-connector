 
import type { FastifyRequest, FastifyReply } from "fastify";
import { CreateUserUseCase } from "../../../core/application/user/use-case/CreateUseCase";
import type { IUserRepository } from "../../../core/domain/user/repositories/IUserRepository";
import { BullEventBus } from "../../event-bus/BullEventBus";
import { CreateUserSchema } from "../schemas/userSchemas";


export class UserController {
    private createUserUseCase: CreateUserUseCase;

    constructor(
    userRepository: IUserRepository,
    eventBus: BullEventBus
  ) {
    this.createUserUseCase = new CreateUserUseCase(
      userRepository,
      eventBus
    );
  }

    public async createUser(req: FastifyRequest, reply: FastifyReply) {
        const body = CreateUserSchema.parse(req.body);
      
        const result = await this.createUserUseCase.execute({email: body.email,
            name: body.name,
            username: body.username,
            role: body.role,
            password: body.password,
        });
        return reply.status(201).send({ userId: result });
    }

}
