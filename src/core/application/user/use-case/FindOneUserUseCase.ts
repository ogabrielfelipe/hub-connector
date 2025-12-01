import { User } from "@/core/domain/user/entities/User";
import UserNotFoundError from "@/core/domain/user/errors/UserNotFoundError";
import { IUserRepository } from "@/core/domain/user/repositories/IUserRepository";
import { CaslAbilityFactory } from "@/core/application/security/casl.factory";
import { ILogger } from "@/core/application/ports/logger.port";
import { NotPermissionError } from "@/core/application/errors/NotPermissionError";
import { Actions } from "@/core/application/security/casl.types";


export class FindOneUserUseCase {
    private readonly abilityFactory: CaslAbilityFactory;
    private readonly logger: ILogger;

    constructor(private readonly userRepo: IUserRepository, abilityFactory: CaslAbilityFactory, logger: ILogger) {
        this.abilityFactory = abilityFactory;
        this.logger = logger;
    }

    async execute(userId: string, currentUserId: string): Promise<User> {
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw new UserNotFoundError();
        }

        const currentUser = await this.userRepo.findById(currentUserId);
        if (!currentUser) {
            throw new UserNotFoundError();
        }

        const ability = this.abilityFactory.createForUser(currentUser);

        if (!ability.can(Actions.Read, user)) {
            this.logger.warn(`User ${currentUser.getUsername()} does not have permission to read user ${user.getUsername()}`);
            throw new NotPermissionError();
        }

        return user;
    }
}