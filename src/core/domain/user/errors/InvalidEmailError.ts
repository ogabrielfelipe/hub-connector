import { DomainError } from "../../errors/DomainError";

class InvalidEmailError extends DomainError {
    constructor(email: string) {
        super(`This email is invalid: ${email}`, 400);
        this.name = 'InvalidEmailError';
    }
}

export default InvalidEmailError;