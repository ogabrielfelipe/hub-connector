import { Gateway } from "../../gateway/entities/Gateway";
import { Routing } from "../entities/Routing";

export type RoutingList = {
    id: string,
    name: string,
    description: string,
    gateway: {
        id: string,
        name: string,
    },
    deletedAt: Date | null,
}

export type RoutingWithPagination = {
    docs: RoutingList[],
    total: number,
    limit: number,
    page: number,
}

export type RoutingDetail = Routing & {
    gateway: Gateway,
}

export interface IRoutingRepository {
    save(routing: Routing): Promise<Routing>;
    update(routing: Routing): Promise<Routing>;
    delete(routing: Routing): Promise<void>;
    findById(id: string): Promise<Routing | null>;
    findOneDetail(id: string): Promise<RoutingDetail | null>;
    findAll({ name, gatewayId, page, limit }: { name?: string, gatewayId?: string, page?: number, limit?: number }): Promise<RoutingWithPagination>;
}