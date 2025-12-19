export abstract class DomainError extends Error {
  public readonly statusCode: number;
  public readonly timestamp: string;

  protected constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }
}
