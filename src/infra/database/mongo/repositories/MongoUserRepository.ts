import { User } from "../../../../core/domain/user/entities/User";
import type { IUserRepository, UserFilter } from "../../../../core/domain/user/repositories/IUserRepository";
import type { Email } from "../../../../core/domain/user/value-objects/Email";
import { UserModel, type UserDocument } from "../models/user.model";



export class MongoUserRepository implements IUserRepository {


    private toDomain(dto: UserDocument): User {
        return User.fromPersistence(
            dto._id.toString(),
            dto.name,
            dto.username,
            dto.email,
            dto.role,
            dto.active,
            dto.password,
        );
    }
    private toPersistence(user: User): Partial<UserDocument> {
        return {
            _id: user.getId(),
            name: user.getName(),
            email: user.getEmail(),
            username: user.getUsername(),
            role: user.getRole() as "user" | "admin" | "dev",
            active: user.getActive(),
            password: user.getPassword(),
        };
    }




    async save(user: User): Promise<User> {
        const dto = this.toPersistence(user);
        const saved = await UserModel.findOneAndUpdate(
            { _id: dto._id! },
            dto,
            { upsert: true, new: true, setDefaultsOnInsert: true }
        ).lean();

        return this.toDomain(saved as UserDocument);
    }

    async findById(id: string): Promise<User | null> {
        const dto: UserDocument | null = await UserModel.findById(id).lean();
        if (!dto) {
            return null;
        }
        return this.toDomain(dto);
    }

    async findByUsername(username: string): Promise<User | null> {
        const dto: UserDocument | null = await UserModel.findOne({ username }).lean();
        if (!dto) {
            return null;
        }
        return this.toDomain(dto);
    }

    async findByEmail(email: Email): Promise<User | null> {
        const dto: UserDocument | null = await UserModel.findOne({ email: email.getValue() }).lean();
        if (!dto) {
            return null;
        }
        return this.toDomain(dto);
    }

    async findAll(filters: UserFilter, page = 1, limit = 10): Promise<User[]> {
        const offset = (page - 1) * limit;
        const queryFilters: any = { ...filters };
        if (queryFilters.name) {
            queryFilters.name = { $regex: queryFilters.name, $options: 'i' };
        }
        const dtos: UserDocument[] = await UserModel.find(queryFilters).skip(offset).limit(limit).lean();
        return dtos.map(dto => this.toDomain(dto));
    }

    async update(user: User): Promise<User> {
        const dto = this.toPersistence(user);
        const updated = await UserModel.findOneAndUpdate(
            { _id: dto._id! },
            dto,
            { new: true }
        ).lean();
        if (!updated) {
            throw new Error("User not found");
        }
        return this.toDomain(updated as UserDocument);
    }
    async delete(id: string): Promise<void> {
        await UserModel.findByIdAndDelete(id);
    }
}