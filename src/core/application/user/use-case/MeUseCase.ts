import { User } from "@/core/domain/user/entities/User";
import { IUserRepository } from "@/core/domain/user/repositories/IUserRepository";

export class MeUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

    async execute(userId: string): Promise<User> { 
        const user = await this.userRepo.findById(userId);
        if(!user){
            throw new Error("User not found");
        }
        return user;
    }
}
