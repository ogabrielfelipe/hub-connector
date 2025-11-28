import { IUserRepository } from "@/core/domain/user/repositories/IUserRepository";
import { ILogger } from "../../ports/logger.port";
import { User, UserRole } from "@/core/domain/user/entities/User";
import { IPasswordHasher } from "../interfaces/security/IPasswordHasher";
import UserNotFoundError from "@/core/domain/user/errors/UserNotFoundError";

interface CreateUserCaseCommand {
    name?: string | undefined;
    email?: string | undefined;
    role?: string | undefined;
    password?: string | undefined;
}


export class UpdateUserUseCase {
    private userRepository: IUserRepository;
    private readonly logger: ILogger;
    private readonly hasher: IPasswordHasher
    

    constructor(userRepository: IUserRepository, logger: ILogger, hasher: IPasswordHasher) {
        this.userRepository = userRepository;
        this.logger = logger;
        this.hasher = hasher;
    }

    public async execute(userId: string, command: CreateUserCaseCommand): Promise<User> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            this.logger.warn(`User not found: ${userId}`);
            throw new UserNotFoundError();
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