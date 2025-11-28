import UserNotFoundError from "@/core/domain/user/errors/UserNotFoundError";
import { IUserRepository } from "@/core/domain/user/repositories/IUserRepository";


export class DeleteUserUseCase {
    constructor(private readonly userRepo: IUserRepository) {}

    async execute(userId: string): Promise<void> { 
        const user = await this.userRepo.findById(userId);
        if(!user){
            throw new UserNotFoundError();
        }
        await this.userRepo.delete(user.getId());
    }
}