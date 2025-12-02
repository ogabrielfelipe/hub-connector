import { number } from "zod";
import type { User } from "../entities/User";
import type { Email } from "../value-objects/Email";


export interface UserFilter {
    name?: string;
    username?: string;
    email?: string | Email;
    role?: string;
    active?: boolean;
}


export interface IUserRepository {
    save(user: User): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findByEmail(email: Email): Promise<User | null>;
    findAll(filters?: UserFilter, page?: number, limit?: number): Promise<User[]>;
    update(user: User): Promise<User>;
    delete(id: string): Promise<void>;
}