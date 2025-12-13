/* eslint-disable @typescript-eslint/no-explicit-any */
import { RedisCacheRepository } from "@/infra/cache/redis/RedisCacheRepository";
import { User } from "../../../core/domain/user/entities/User";
import type {
  IUserRepository,
  UserFilter,
} from "../../../core/domain/user/repositories/IUserRepository";
import type { Email } from "../../../core/domain/user/value-objects/Email";
import { UserModel, type UserDocument } from "../models/userModel";
import { CacheRepository } from "@/core/application/ports/CacheRepository";

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

  private cacheRepository: CacheRepository;

  constructor() {
    this.cacheRepository = new RedisCacheRepository();
  }

  async save(user: User): Promise<User> {
    const dto = this.toPersistence(user);
    const saved = await UserModel.findOneAndUpdate({ _id: dto._id! }, dto, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }).lean();
    await this.cacheRepository.set(`users:${saved._id!.toString()}`, saved);
    await this.cacheRepository.set(`users:byUsername:${saved.username}`, saved);
    await this.cacheRepository.set(`users:byEmail:${saved.email}`, saved);
    return this.toDomain(saved as UserDocument);
  }

  async findById(id: string): Promise<User | null> {
    const cached = await this.cacheRepository.get<UserDocument>(`users:${id}`);
    if (cached) {
      return this.toDomain(cached);
    }
    const dto: UserDocument | null = await UserModel.findById(id).lean();
    if (!dto) {
      return null;
    }
    await this.cacheRepository.set(`users:${dto._id!.toString()}`, dto);
    await this.cacheRepository.set(`users:byUsername:${dto.username}`, dto);
    await this.cacheRepository.set(`users:byEmail:${dto.email}`, dto);
    return this.toDomain(dto);
  }

  async findByUsername(username: string): Promise<User | null> {
    const cached = await this.cacheRepository.get<UserDocument>(
      `users:byUsername:${username}`,
    );
    if (cached) {
      return this.toDomain(cached);
    }
    const dto: UserDocument | null = await UserModel.findOne({
      username,
      $and: [{ active: true }],
    }).lean();
    if (!dto) {
      return null;
    }
    await this.cacheRepository.set(`users:byUsername:${dto.username}`, dto);
    await this.cacheRepository.set(`users:byEmail:${dto.email}`, dto);
    return this.toDomain(dto);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const cached = await this.cacheRepository.get<UserDocument>(
      `users:byEmail:${email.getValue()}`,
    );
    if (cached) {
      return this.toDomain(cached);
    }
    const dto: UserDocument | null = await UserModel.findOne({
      email: email.getValue(),
      $and: [{ active: true }],
    }).lean();
    if (!dto) {
      return null;
    }
    await this.cacheRepository.set(`users:byEmail:${dto.email}`, dto);
    await this.cacheRepository.set(`users:byUsername:${dto.username}`, dto);
    return this.toDomain(dto);
  }

  async findAll(
    filters: UserFilter,
    page = 1,
    limit = 10,
  ): Promise<{ docs: User[]; total: number; page: number; limit: number }> {
    const offset = (page - 1) * limit;
    const queryFilters: any = { ...filters };
    if (queryFilters.name) {
      queryFilters.name = { $regex: queryFilters.name, $options: "i" };
    }
    const dtos: UserDocument[] = await UserModel.find(queryFilters)
      .skip(offset)
      .limit(limit)
      .lean();
    const total = await UserModel.countDocuments(queryFilters);
    return { docs: dtos.map((dto) => this.toDomain(dto)), total, page, limit };
  }

  async update(user: User): Promise<User> {
    const dto = this.toPersistence(user);
    const updated = await UserModel.findOneAndUpdate({ _id: dto._id! }, dto, {
      new: true,
    }).lean();
    if (!updated) {
      throw new Error("User not found");
    }
    await this.cacheRepository.set(`users-${updated._id!.toString()}`, updated);
    await this.cacheRepository.set(
      `users:byUsername:${updated.username}`,
      updated,
    );
    await this.cacheRepository.set(`users:byEmail:${updated.email}`, updated);
    return this.toDomain(updated as UserDocument);
  }
  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
    await this.cacheRepository.del(`users:${id}`);
    await this.cacheRepository.del(`users:byUsername:${id}`);
    await this.cacheRepository.del(`users:byEmail:${id}`);
  }
}
