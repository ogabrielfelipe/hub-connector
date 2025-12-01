import { IUserRepository } from "@/core/domain/user/repositories/IUserRepository";
import { ILogger } from "../../ports/logger.port";
import { User, UserRole } from "@/core/domain/user/entities/User";
import { IPasswordHasher } from "../interfaces/security/IPasswordHasher";
import UserNotFoundError from "@/core/domain/user/errors/UserNotFoundError";
import { CaslAbilityFactory } from "../../security/casl.factory";
import { Actions } from "../../security/casl.types";
import { NotPermissionError } from "../../errors/NotPermissionError";

interface UpdateUserCaseCommand {
    name?: string | undefined;
    email?: string | undefined;
    role?: string | undefined;
    password?: string | undefined;
}


export class UpdateUserUseCase {
    private userRepository: IUserRepository;
    private readonly logger: ILogger;
    private readonly hasher: IPasswordHasher
    private readonly abilityFactory: CaslAbilityFactory;

    constructor(userRepository: IUserRepository, logger: ILogger, hasher: IPasswordHasher, abilityFactory: CaslAbilityFactory) {
        this.userRepository = userRepository;
        this.logger = logger;
        this.hasher = hasher;
        this.abilityFactory = abilityFactory;
    }

    public async execute(userId: string, command: UpdateUserCaseCommand, currentUserId: string): Promise<User> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            this.logger.warn(`User not found.`);
            throw new UserNotFoundError();
        }


        const currentUser = await this.userRepository.findById(currentUserId);
        if (!currentUser) {
            this.logger.warn(`Current user not found.`);
            throw new UserNotFoundError();
        }
        const ability = this.abilityFactory.createForUser(currentUser);


        if (!ability.can(Actions.Update, user)) {
            this.logger.warn(`User ${currentUser.getUsername()} does not have permission to update user ${user.getUsername()}`);
            throw new NotPermissionError();
        }

        if (command.name) {
            user.updateName(command.name);
        }
        if (command.email) {
            user.updateEmail(command.email);
        }
        if (command.role) {
            user.updateRole(command.role === 'ADMIN' ? UserRole.ADMIN : command.role === 'USER' ? UserRole.USER : UserRole.DEV);
        }
        if (command.password) {
            const passwordHash = await this.hasher.hash(command.password)
            user.updatePassword(passwordHash);
        }

        return await this.userRepository.update(user);
    }

}