export class NotPermissionError extends Error {
    public readonly statusCode: number;
    public readonly timestamp: string;

    constructor() {
        super("User does not have permission to perform this action");
        this.statusCode = 403;
        this.timestamp = new Date().toISOString();
    }
}