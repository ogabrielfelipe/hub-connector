import {
  fastify,
  FastifyInstance,
  type FastifyReply,
  type FastifyRequest,
} from "fastify";
import type { IUserRepository } from "../../../core/domain/user/repositories/IUserRepository";
import { LoginUserUseCase } from "@/core/application/user/use-case/LoginUseCase";
import { IPasswordHasher } from "@/core/application/user/interfaces/security/IPasswordHasher";
import { ITokenService } from "@/core/application/user/interfaces/security/ITokenService";
import { LoginSchema } from "../schemas/authSchemas";
import { MeUseCase } from "@/core/application/user/use-case/MeUseCase";
import { LoginUserWithGitHubSSOUseCase } from "@/core/application/user/use-case/LoginUserWithGitHubSSOUseCase";

export interface GitHubUser {
  id: number;
  login: string;
  name: string;
  email: string | null;
  avatar_url: string;
}

export class AuthController {
  private loginUseCase: LoginUserUseCase;
  private loginUserWithGitHubSSOUseCase: LoginUserWithGitHubSSOUseCase;
  private meUseCase: MeUseCase;

  constructor(
    userRepository: IUserRepository,
    hasher: IPasswordHasher,
    token: ITokenService,
    private readonly app: FastifyInstance,
  ) {
    this.loginUseCase = new LoginUserUseCase(userRepository, hasher, token);
    this.meUseCase = new MeUseCase(userRepository);
    this.loginUserWithGitHubSSOUseCase = new LoginUserWithGitHubSSOUseCase(
      userRepository,
      token,
    );
  }

  public async loginUser(req: FastifyRequest, reply: FastifyReply) {
    const body = LoginSchema.parse(req.body);

    const result = await this.loginUseCase.execute({
      username: body.username,
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

    return reply.status(200).send({
      id: user.getId(),
      name: user.getName(),
      username: user.getUsername(),
      role: user.getRole(),
      email: user.getEmail(),
    });
  }

  public async githubLogin(req: FastifyRequest, reply: FastifyReply) {
    const result = await this.app.githubOAuth2.generateAuthorizationUri(
      req,
      reply,
    );
    return reply.status(200).send({ url: result });
  }

  public async githubCallback(req: FastifyRequest, reply: FastifyReply) {
    const { code } = req.body as { code: string; state: string };

    // ✅ Troca o code pelo token diretamente na API do GitHub
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      },
    ).then(
      (r) => r.json() as Promise<{ access_token: string; error?: string }>,
    );

    if (tokenResponse.error || !tokenResponse.access_token) {
      return reply.status(401).send({ error: "Código inválido ou expirado" });
    }

    // Busca dados do usuário no GitHub
    const [githubUser, emails] = await Promise.all([
      fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
          "User-Agent": "MyApp",
        },
      }).then((r) => r.json() as Promise<GitHubUser>),

      fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
          "User-Agent": "MyApp",
        },
      }).then(
        (r) =>
          r.json() as Promise<
            { email: string; primary: boolean; verified: boolean }[]
          >,
      ),
    ]);

    // Pega o email primário e verificado
    const primaryEmail = emails.find((e) => e.primary && e.verified)?.email;

    if (!primaryEmail) {
      return reply
        .status(400)
        .send({ error: "Nenhum email verificado encontrado no GitHub" });
    }

    const loginResult = await this.loginUserWithGitHubSSOUseCase.execute({
      providerId: githubUser.id.toString(),
      email: primaryEmail,
      login: githubUser.login,
      name: githubUser.name,
      avatar: githubUser.avatar_url,
    });

    return reply.status(200).send({ token: loginResult });
  }
}
