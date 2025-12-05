import { Gateway } from "../entities/Gateway";

export interface GatewayDTO {
  id: string;
  name: string;
  active: boolean;
}

export interface IGatewayRepository {
  findById(id: string): Promise<Gateway | null>;
  findByKey(key: string): Promise<Gateway | null>;
  findAll({
    name,
    active,
    page,
    limit,
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
  }>;
  save(gateway: Gateway): Promise<Gateway>;
  update(gateway: Gateway): Promise<Gateway>;
  delete(id: string): Promise<void>;
}
