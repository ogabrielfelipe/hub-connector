import { IUserRepository, UserFilter } from "@/core/domain/user/repositories/IUserRepository";
import type { User } from "@/core/domain/user/entities/User";


interface FindAllUsersUseCaseCommand {
    filters?: UserFilter;
    page: number;
    limit: number;
}

export class FindAllUsersUseCase {
    constructor(private readonly userRepo: IUserRepository) { }

    async execute(command: FindAllUsersUseCaseCommand): Promise<{ docs: User[], total: number, page: number, limit: number }> {
        const users = await this.userRepo.findAll(command.filters, command.page, command.limit);

        return {
            docs: users,
            total: users.length,
            page: command.page,
            limit: command.limit
        };
    }
}