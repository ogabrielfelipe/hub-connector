import { Gateway } from "../../gateway/entities/Gateway";
import { Routing } from "../entities/Routing";

export type RoutingList = {
  id: string;
  name: string;
  slug: string;
  description: string;
  gateway: {
    id: string;
    name: string;
  };
  deletedAt: Date | null;
};

export type RoutingWithPagination = {
  docs: RoutingList[];
  total: number;
  limit: number;
  page: number;
};

export type RoutingDetail = Routing & {
  gateway: Gateway;
};

export interface IRoutingRepository {
  save(routing: Routing): Promise<Routing>;
  update(routing: Routing): Promise<Routing>;
  delete(routing: Routing): Promise<void>;
  findById(id: string): Promise<Routing | null>;
  findOneDetail(id: string): Promise<RoutingDetail | null>;
  findOneBySlug(slug: string): Promise<Routing | null>;
  findAllByGatewayId(gatewayId: string): Promise<Routing[]>;
  findAll({
    name,
    slug,
    gatewayId,
    page,
    limit,
  }: {
    name?: string;
    slug?: string;
    gatewayId?: string;
    page?: number;
    limit?: number;
  }): Promise<RoutingWithPagination>;
}
