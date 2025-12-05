import { DomainError } from "../../errors/DomainError";

class GatewayNotFoundError extends DomainError {
  constructor() {
    super(`Gateway not found`, 404);
    this.name = "GatewayNotFoundError";
  }
}

export default GatewayNotFoundError;
