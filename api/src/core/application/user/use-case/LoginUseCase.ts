import { IUserRepository } from "@/core/domain/user/repositories/IUserRepository";
import { IPasswordHasher } from "../interfaces/security/IPasswordHasher";
import { ITokenService } from "../interfaces/security/ITokenService";
import bcrypt from "bcrypt";


export class LoginUserUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly hasher: IPasswordHasher,
    private readonly token: ITokenService,
  ) { }

  async execute({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<string> {
    const user = await this.userRepo.findByUsername(username);
    if (!user) {
      throw new Error("Invalid credentials");
    }
    console.log(user)
    console.log(password)
    console.log(password.length)
    console.log(user.getPassword())
    console.log(bcrypt.compareSync(password, user.getPassword()))
    const valid = await this.hasher.compare(password, user.getPassword());
    console.log(valid)
    if (!valid) {
      throw new Error("Invalid credentials");
    }

    return this.token.generate({
      userId: user.getId(),
      role: user.getRole(),
    });
  }
}
