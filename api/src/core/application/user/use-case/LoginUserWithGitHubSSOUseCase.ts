import { IUserRepository } from "@/core/domain/user/repositories/IUserRepository";
import { ITokenService } from "../interfaces/security/ITokenService";
import { Email } from "@/core/domain/user/value-objects/Email";
import { User, UserRole } from "@/core/domain/user/entities/User";

interface LoginUserWithGitHubSSOUseCaseCommand {
  providerId: string;
  email: string;
  login: string;
  name: string;
  avatar: string;
}

export class LoginUserWithGitHubSSOUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly token: ITokenService,
  ) {}

  async execute({
    providerId,
    email,
    login,
    name,
    avatar,
  }: LoginUserWithGitHubSSOUseCaseCommand): Promise<string> {
    const user = await this.userRepo.findByProviderIdOrEmail(
      providerId,
      new Email(email),
    );
    if (!user) {
      const newUser = User.createNew(
        name,
        login,
        new Email(email),
        UserRole.USER,
        "",
        providerId,
        avatar,
      );
      await this.userRepo.save(newUser);
      return this.token.generate({
        userId: newUser.getId(),
        role: newUser.getRole(),
      });
    }
    if (user.getAvatar() !== avatar) {
      user.updateAvatar(avatar);
      await this.userRepo.update(user);
    }
    return this.token.generate({
      userId: user.getId(),
      role: user.getRole(),
    });
  }
}
