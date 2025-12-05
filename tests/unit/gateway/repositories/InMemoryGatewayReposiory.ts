import { Gateway } from "@/core/domain/gateway/entities/Gateway";
import {
  GatewayDTO,
  IGatewayRepository,
} from "@/core/domain/gateway/repositories/IGatewayRepository";

export class InMemoryGatewayReposiory implements IGatewayRepository {
  private gateways: Gateway[] = [];

  public async findById(id: string): Promise<Gateway | null> {
    return this.gateways.find((gateway) => gateway.getId() === id) || null;
  }

  public async findByKey(key: string): Promise<Gateway | null> {
    return (
      this.gateways.find((gateway) => gateway.getXApiKey() === key) || null
    );
  }

  public async findAll({
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
    let filteredGateways = this.gateways;
    if (name) {
      filteredGateways = filteredGateways.filter(
        (gateway) => gateway.getName() === name,
      );
    } else if (active) {
      filteredGateways = filteredGateways.filter(
        (gateway) => gateway.getActive() === active,
      );
    }

    if (page !== undefined && limit !== undefined) {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      filteredGateways = filteredGateways.slice(startIndex, endIndex);
    }

    const result: GatewayDTO[] = filteredGateways.map((gateway) => ({
      id: gateway.getId(),
      name: gateway.getName(),
      active: gateway.getActive(),
    }));

    return { docs: result, total: filteredGateways.length, page, limit };
  }

  public async save(gateway: Gateway): Promise<Gateway> {
    this.gateways.push(gateway);
    return gateway;
  }

  public async update(gateway: Gateway): Promise<Gateway> {
    const index =
      this.gateways.findIndex(
        (gateway) => gateway.getId() === gateway.getId(),
      ) || 0;
    this.gateways[index] = gateway;
    return gateway;
  }

  public async delete(id: string): Promise<void> {
    this.gateways = this.gateways.filter((gateway) => gateway.getId() !== id);
  }

  public clear() {
    this.gateways = [];
  }
}
