import {
  IUserRepository,
  UserFilter,
} from "@/core/domain/user/repositories/IUserRepository";
import type { User } from "@/core/domain/user/entities/User";
import UserNotFoundError from "@/core/domain/user/errors/UserNotFoundError";
import { CaslAbilityFactory } from "@/core/application/security/casl.factory";
import { Actions } from "@/core/application/security/casl.types";
import { ILogger } from "../../ports/logger.port";

interface FindAllUsersUseCaseCommand {
  filters?: UserFilter;
  page: number;
  limit: number;
}

export class FindAllUsersUseCase {
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

  async execute(
    command: FindAllUsersUseCaseCommand,
    currentUserId: string,
  ): Promise<{ docs: User[]; total: number; page: number; limit: number }> {
    const currentUser = await this.userRepo.findById(currentUserId);
    if (!currentUser) {
      throw new UserNotFoundError();
    }

    const ability = this.abilityFactory.createForUser(currentUser);

    const users = await this.userRepo.findAll(
      command.filters,
      command.page,
      command.limit,
    );

    const filteredUsers = users.docs.filter((user) =>
      ability.can(Actions.Read, user),
    );

    const usersFiltered = {
      ...users,
      docs: filteredUsers,
    };

    return usersFiltered;
  }
}
