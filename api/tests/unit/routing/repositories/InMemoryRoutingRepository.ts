import { Routing } from "@/core/domain/routing/entities/Routing";
import {
  IRoutingRepository,
  RoutingDetail,
  RoutingList,
  RoutingWithPagination,
} from "@/core/domain/routing/repositories/IRoutingRepository";
import { InMemoryGatewayReposiory } from "../../gateway/repositories/InMemoryGatewayReposiory";

export class InMemoryRoutingRepository implements IRoutingRepository {
  private repository: Routing[] = [];
  private gatewayRepository: InMemoryGatewayReposiory;

  constructor(gatewayRepository: InMemoryGatewayReposiory) {
    this.gatewayRepository = gatewayRepository;
  }

  public async save(routing: Routing): Promise<Routing> {
    this.repository.push(routing);
    return routing;
  }

  public async update(routing: Routing): Promise<Routing> {
    const index = this.repository.findIndex(
      (r) => r.getId() === routing.getId(),
    );
    this.repository[index] = routing;
    return routing;
  }

  public async delete(routing: Routing): Promise<void> {
    const index = this.repository.findIndex(
      (r) => r.getId() === routing.getId(),
    );
    this.repository.splice(index, 1);
  }

  public async findById(id: string): Promise<Routing | null> {
    return this.repository.find((r) => r.getId() === id) || null;
  }

  public async findOneDetail(id: string): Promise<RoutingDetail | null> {
    const routing = this.repository.find((r) => r.getId() === id) || null;
    if (!routing) {
      return null;
    }
    const gateway = await this.gatewayRepository.findById(
      routing.getGatewayId(),
    );
    if (!gateway) {
      return null;
    }

    // Return the routing instance with gateway property added
    return Object.assign(routing, { gateway }) as RoutingDetail;
  }

  public async findOneBySlug(slug: string): Promise<Routing | null> {
    return this.repository.find((r) => r.getSlug() === slug) || null;
  }

  public async findAll({
    name,
    gatewayId,
    page,
    limit,
  }: {
    name?: string;
    gatewayId?: string;
    page?: number;
    limit?: number;
  }): Promise<RoutingWithPagination> {
    let filteredRoutings = this.repository;
    if (name) {
      filteredRoutings = filteredRoutings.filter(
        (routing) => routing.getName() === name,
      );
    } else if (gatewayId) {
      filteredRoutings = filteredRoutings.filter(
        (routing) => routing.getGatewayId() === gatewayId,
      );
    }

    if (page !== undefined && limit !== undefined) {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      filteredRoutings = filteredRoutings.slice(startIndex, endIndex);
    }

    const routingFiltered: RoutingList[] = await Promise.all(
      filteredRoutings.map(async (routing) => {
        const gateway = await this.gatewayRepository.findById(
          routing.getGatewayId(),
        );

        return {
          id: routing.getId(),
          slug: routing.getSlug(),
          name: routing.getName(),
          description: routing.getDescription(),
          method: routing.getMethod(),
          url: routing.getUrl(),
          gateway: {
            id: gateway?.getId() || "",
            name: gateway?.getName() || "",
          },
          deletedAt: routing.getDeletedAt(),
        };
      }),
    );

    const result: RoutingWithPagination = {
      docs: routingFiltered,
      total: filteredRoutings.length,
      limit: limit || filteredRoutings.length,
      page: page || 1,
    };

    return result;
  }

  public async findAllByGatewayId(gatewayId: string): Promise<Routing[]> {
    return this.repository.filter(
      (r) => r.getGatewayId().toString() === gatewayId,
    );
  }

  public clear() {
    this.repository = [];
  }
}
