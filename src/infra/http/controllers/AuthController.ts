 
import type { FastifyRequest, FastifyReply } from "fastify";
import type { IUserRepository } from "../../../core/domain/user/repositories/IUserRepository";
import { LoginUserUseCase } from "@/core/application/user/use-case/LoginUseCase";
import { IPasswordHasher } from "@/core/application/user/interfaces/security/IPasswordHasher";
import { ITokenService } from "@/core/application/user/interfaces/security/ITokenService";
import { LoginSchema } from "../schemas/authSchemas";



export class AuthController {
    private loginUseCase: LoginUserUseCase;

    constructor(
    userRepository: IUserRepository,
    hasher: IPasswordHasher,
    token: ITokenService
  ) {
    this.loginUseCase = new LoginUserUseCase(
      userRepository,
      hasher,
      token
    );
  }

    public async loginUser(req: FastifyRequest, reply: FastifyReply) {
        const body = LoginSchema.parse(req.body);

        const result = await this.loginUseCase.execute({username: body.username,
            password: body.password,
        });
        return reply.status(200).send({ token: result });
    }

}
