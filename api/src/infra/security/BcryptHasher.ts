import { IPasswordHasher } from "@/core/application/user/interfaces/security/IPasswordHasher";
import bcrypt from "bcrypt";

export class BcryptHasher implements IPasswordHasher {
  private readonly SALT_ROUNDS = 10;

  hash(plain: string): Promise<string> {
    const salt = bcrypt.genSaltSync(this.SALT_ROUNDS);
    return bcrypt.hash(plain, salt);
  }
  compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
