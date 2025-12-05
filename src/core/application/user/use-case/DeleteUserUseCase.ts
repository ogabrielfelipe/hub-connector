import UserNotFoundError from "@/core/domain/user/errors/UserNotFoundError";
import { IUserRepository } from "@/core/domain/user/repositories/IUserRepository";
import { CaslAbilityFactory } from "../../security/casl.factory";
import { ILogger } from "../../ports/logger.port";
import { NotPermissionError } from "../../errors/NotPermissionError";
import { Actions } from "../../security/casl.types";

export class DeleteUserUseCase {
  private readonly abilityFactory: CaslAbilityFactory;
  private readonly logger: ILogger;
  constructor(
    private readonly userRepo: IUserRepository,
    abilityFactory: CaslAbilityFactory,
    logger: ILogger,
  ) {
    this.abilityFactory = abilityFactory;
    this.logger = logger;
  }

  async execute(userId: string, currentUserId: string): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new UserNotFoundError();
    }

    const currentUser = await this.userRepo.findById(currentUserId);
    if (!currentUser) {
      throw new UserNotFoundError();
    }
    const ability = this.abilityFactory.createForUser(currentUser);

    if (!ability.can(Actions.Delete, user)) {
      this.logger.warn(
        `User ${currentUser.getUsername()} does not have permission to delete user ${user.getUsername()}`,
      );
      throw new NotPermissionError();
    }

    await this.userRepo.delete(user.getId());
  }
}
