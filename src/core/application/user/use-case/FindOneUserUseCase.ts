import { User } from "@/core/domain/user/entities/User";
import UserNotFoundError from "@/core/domain/user/errors/UserNotFoundError";
import { IUserRepository } from "@/core/domain/user/repositories/IUserRepository";


export class FindOneUserUseCase {
    constructor(private readonly userRepo: IUserRepository) {}

    async execute(userId: string): Promise<User> { 
        const user = await this.userRepo.findById(userId);
        if(!user){
            throw new UserNotFoundError();
        }
        return user;
    }
}