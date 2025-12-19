/* eslint-disable @typescript-eslint/no-explicit-any */
import { Gateway } from "@/core/domain/gateway/entities/Gateway";
import {
  GatewayDTO,
  IGatewayRepository,
} from "@/core/domain/gateway/repositories/IGatewayRepository";
import { GatewayDocument, GatewayModel } from "../models/gatewayModel";
import { GatewayConverter } from "../converters/GatewayConverter";
import { CacheRepository } from "@/core/application/ports/CacheRepository";
import { RedisCacheRepository } from "@/infra/cache/redis/RedisCacheRepository";

export class MongoGatewayRepository implements IGatewayRepository {
  private gatewayConverter: GatewayConverter;
  private cacheRepository: CacheRepository;

  constructor() {
    this.gatewayConverter = new GatewayConverter();
    this.cacheRepository = new RedisCacheRepository();
  }

  async findById(id: string): Promise<Gateway | null> {
    const cached = await this.cacheRepository.get<GatewayDocument>(
      `gateways:detail:${id}`,
    );
    if (cached) {
      return this.gatewayConverter.toDomain(cached);
    }
    const dto: GatewayDocument | null = await GatewayModel.findById(id).lean();
    if (!dto) {
      return null;
    }
    await this.cacheRepository.set(`gateways:detail:${id}`, dto);
    return this.gatewayConverter.toDomain(dto);
  }
  async findByKey(key: string): Promise<Gateway | null> {
    const cached = await this.cacheRepository.get<GatewayDocument>(
      `gateways:key:${key}`,
    );
    if (cached) {
      return this.gatewayConverter.toDomain(cached);
    }
    const dto: GatewayDocument | null = await GatewayModel.findOne({
      xApiKey: key,
    }).lean();
    if (!dto) {
      return null;
    }
    await this.cacheRepository.set(`gateways:key:${key}`, dto);
    return this.gatewayConverter.toDomain(dto);
  }
  async findAll({
    name,
    active,
    page = 1,
    limit = 10,
  }: {
    name?: string;
    active?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{
    docs: GatewayDTO[];
    total: number;
    page: number;
    limit: number;
  }> {
    const offset = (page - 1) * limit;
    const queryFilters: any = {};
    if (name) {
      queryFilters.name = { $regex: name, $options: "i" };
    }
    if (active !== undefined) {
      queryFilters.active = active;
    }
    const dtos: GatewayDocument[] = await GatewayModel.find(queryFilters)
      .skip(offset)
      .limit(limit)
      .lean();
    const total = await GatewayModel.countDocuments(queryFilters);
    return {
      docs: dtos.map((dto) => ({
        id: dto._id.toString(),
        name: dto.name,
        active: dto.active,
      })),
      total,
      page,
      limit,
    };
  }
  async save(gateway: Gateway): Promise<Gateway> {
    const dto = this.gatewayConverter.toPersistence(gateway);
    const saved = await GatewayModel.findOneAndUpdate({ _id: dto._id! }, dto, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }).lean();
    await this.cacheRepository.set(
      `gateways:detail:${dto._id!.toString()}`,
      saved,
    );
    await this.cacheRepository.set(`gateways:key:${dto.xApiKey}`, saved);
    return this.gatewayConverter.toDomain(saved as GatewayDocument);
  }
  async update(gateway: Gateway): Promise<Gateway> {
    const dto = this.gatewayConverter.toPersistence(gateway);
    const updated = await GatewayModel.findOneAndUpdate(
      { _id: dto._id! },
      dto,
      { new: true },
    ).lean();
    if (!updated) {
      throw new Error("Gateway not found");
    }
    await this.cacheRepository.set(
      `gateways:detail:${updated._id!.toString()}`,
      updated,
    );
    await this.cacheRepository.set(`gateways:key:${updated.xApiKey}`, updated);
    return this.gatewayConverter.toDomain(updated as GatewayDocument);
  }
  async delete(id: string): Promise<void> {
    await GatewayModel.findByIdAndDelete(id);
    await this.cacheRepository.del(`gateways:detail:${id}`);
    await this.cacheRepository.del(`gateways:key:${id}`);
  }
}
