import { DomainError } from "../../errors/DomainError";

class UsernameUsedError extends DomainError {
  constructor(username: string) {
    super(`This username is already in use: ${username}`, 400);
    this.name = "UsernameUsedError";
  }
}

export default UsernameUsedError;
