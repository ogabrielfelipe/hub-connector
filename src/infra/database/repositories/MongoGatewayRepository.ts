import { Gateway } from "@/core/domain/gateway/entities/Gateway";
import { GatewayDTO, IGatewayRepository } from "@/core/domain/gateway/repositories/IGatewayRepository";
import { GatewayDocument, GatewayModel } from "../models/gateway.model";


export class MongoGatewayRepository implements IGatewayRepository {

    private toDomain(dto: GatewayDocument): Gateway {
        return Gateway.fromPersistence(
            dto._id.toString(),
            dto.name,
            dto.xApiKey,
            dto.active,
            dto.createdAt,
            dto.updatedAt,
            dto.routes,
        );
    }
    private toPersistence(gateway: Gateway): Partial<GatewayDocument> {
        return {
            _id: gateway.getId(),
            name: gateway.getName(),
            xApiKey: gateway.getXApiKey(),
            routes: gateway.getRoutes(),
            active: gateway.getActive(),
            createdAt: gateway.getCreatedAt(),
            updatedAt: gateway.getUpdatedAt(),
        };
    }




    async findById(id: string): Promise<Gateway | null> {
        const dto: GatewayDocument | null = await GatewayModel.findById(id).lean();
        if (!dto) {
            return null;
        }
        return this.toDomain(dto);
    }
    async findByKey(key: string): Promise<Gateway | null> {
        const dto: GatewayDocument | null = await GatewayModel.findOne({ xApiKey: key }).lean();
        if (!dto) {
            return null;
        }
        return this.toDomain(dto);
    }
    async findAll({ name, active, page = 1, limit = 10 }: { name?: string; active?: boolean; page?: number; limit?: number; }): Promise<{ docs: GatewayDTO[], total: number, page: number, limit: number }> {
        const offset = (page - 1) * limit;
        const queryFilters: any = {};
        if (name) {
            queryFilters.name = { $regex: name, $options: 'i' };
        }
        if (active !== undefined) {
            queryFilters.active = active;
        }
        const dtos: GatewayDocument[] = await GatewayModel.find(queryFilters).skip(offset).limit(limit).lean();
        const total = await GatewayModel.countDocuments(queryFilters);
        return { docs: dtos.map(dto => ({ id: dto._id.toString(), name: dto.name, active: dto.active })), total, page, limit };
    }
    async save(gateway: Gateway): Promise<Gateway> {
        const dto = this.toPersistence(gateway);
        const saved = await GatewayModel.findOneAndUpdate(
            { _id: dto._id! },
            dto,
            { upsert: true, new: true, setDefaultsOnInsert: true }
        ).lean();
        return this.toDomain(saved as GatewayDocument);
    }
    async update(gateway: Gateway): Promise<Gateway> {
        const dto = this.toPersistence(gateway);
        const updated = await GatewayModel.findOneAndUpdate(
            { _id: dto._id! },
            dto,
            { new: true }
        ).lean();
        if (!updated) {
            throw new Error("Gateway not found");
        }
        return this.toDomain(updated as GatewayDocument);
    }
    async delete(id: string): Promise<void> {
        await GatewayModel.findByIdAndDelete(id);
    }

}