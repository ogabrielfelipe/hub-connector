import InvalidEmailError from "../errors/InvalidEmailError";

export class Email {
    private readonly value: string;

    constructor(email: string) {
        if (!Email.isValidEmail(email)) {
            throw new InvalidEmailError(email);
        }
        this.value = email.toLowerCase();
    }

    private static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: Email): boolean {
        return this.value === other.value;
    }
}