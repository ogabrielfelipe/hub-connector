import { IUserRepository, UserFilter } from "@/core/domain/user/repositories/IUserRepository";
import { User } from "@/core/domain/user/entities/User";
import { Email } from "@/core/domain/user/value-objects/Email";

export class InMemoryUserRepository implements IUserRepository {
    public users: User[] = [];

    async findById(id: string): Promise<User | null> {
        return this.users.find(u => u.getId() === id) ?? null;
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.users.find(u => u.getUsername() === username) ?? null;
    }

    async findByEmail(email: Email): Promise<User | null> {
        return this.users.find(u => u.getEmail() === email.toString()) ?? null;
    }

    async findAll(filters?: UserFilter, page?: number, limit?: number): Promise<{ docs: User[], total: number, page: number, limit: number }> {
        let filteredUsers = this.users;

        if (filters) {
            filteredUsers = filteredUsers.filter(user => {
                for (const key in filters) {
                    if (Object.prototype.hasOwnProperty.call(filters, key)) {
                        const filterValue = (filters as any)[key];
                        switch (key) {
                            case 'username':
                                if (user.getUsername() !== filterValue) return false;
                                break;
                            case 'email':
                                if (user.getEmail() !== filterValue.toString()) return false; // Assuming Email value object
                                break;
                            case 'name':
                                if (user.getName() !== filterValue) return false;
                                break;
                            default:
                                break;
                        }
                    }
                }
                return true;
            });
        }

        if (page !== undefined && limit !== undefined) {
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            filteredUsers = filteredUsers.slice(startIndex, endIndex);
        }

        return {
            docs: filteredUsers,
            total: this.users.length,
            page: page || 1,
            limit: limit || 10
        };

    }

    async save(user: User): Promise<User> {
        this.users.push(user);
        return user;
    }

    async update(user: User): Promise<User> {
        const index = this.users.findIndex(u => u.getId() === user.getId());
        this.users[index] = user;
        return user;
    }

    async delete(id: string): Promise<void> {
        this.users = this.users.filter(u => u.getId() !== id);
    }


    clear() {
        this.users = [];
    }
}
