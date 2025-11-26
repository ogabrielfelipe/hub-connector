import type { User } from "../entities/User";
import type { Email } from "../value-objects/Email";


export interface IUserRepository {
    save(user: User): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findByEmail(email: Email): Promise<User | null>;
    update(user: User): Promise<User>;
    delete(id: string): Promise<void>;
}