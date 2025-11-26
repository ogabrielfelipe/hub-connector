 
import type { FastifyReply, FastifyRequest,  } from "fastify";
import type { IUserRepository } from "../../../core/domain/user/repositories/IUserRepository";
import { LoginUserUseCase } from "@/core/application/user/use-case/LoginUseCase";
import { IPasswordHasher } from "@/core/application/user/interfaces/security/IPasswordHasher";
import { ITokenService } from "@/core/application/user/interfaces/security/ITokenService";
import { LoginSchema } from "../schemas/authSchemas";
import { MeUseCase } from "@/core/application/user/use-case/MeUseCase";



export class AuthController {
    private loginUseCase: LoginUserUseCase;
    private meUseCase: MeUseCase;

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
    this.meUseCase = new MeUseCase(userRepository);
  }

    public async loginUser(req: FastifyRequest, reply: FastifyReply) {
        const body = LoginSchema.parse(req.body);

        const result = await this.loginUseCase.execute({username: body.username,
            password: body.password,
        });
        return reply.status(200).send({ token: result });
    }

    public async me(req: FastifyRequest, reply: FastifyReply) {
        if (!req.user) {
            return reply.status(401).send({ error: "Unauthorized" });
        }  

        const user = await this.meUseCase.execute(req.user.userId);
        
        if (!user) {
            return reply.status(404).send({ error: "User not found" });
        }

        return reply.status(200).send({id: user.getId(), name: user.getName(), username: user.getUsername(), role: user.getRole(), email: user.getEmail() });
    }

}
