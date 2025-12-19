import { DomainError } from "../../errors/DomainError";

class RoutingNotFoundError extends DomainError {
  constructor() {
    super(`Routing not found`, 404);
    this.name = "RoutingNotFoundError";
  }
}

export default RoutingNotFoundError;
