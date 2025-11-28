import { DomainError } from "../../errors/DomainError";

class UserNotFoundError extends DomainError {
    constructor() {
        super(`User not found`, 404);
        this.name = 'UserNotFoundError';
    }
}

export default UserNotFoundError;