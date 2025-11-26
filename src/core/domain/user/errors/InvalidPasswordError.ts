import { DomainError } from "../../errors/DomainError";


export class InvalidPasswordError extends DomainError {
  constructor() {
    super(
      "Password must be at least 8 characters long and contain at least one number and one letter and one special character.",
      422 // Unprocessable Entity
    );
  }
}
