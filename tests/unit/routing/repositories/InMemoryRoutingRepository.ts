import { Routing } from "@/core/domain/routing/entities/Routing";
import { IRoutingRepository, RoutingList, RoutingWithPagination } from "@/core/domain/routing/repositories/IRoutingRepository";


export class InMemoryRoutingRepository implements IRoutingRepository {

    private repository: Routing[] = [];

    public async save(routing: Routing): Promise<Routing> {
        this.repository.push(routing);
        return routing;
    }

    public async update(routing: Routing): Promise<Routing> {
        const index = this.repository.findIndex((r) => r.getId() === routing.getId());
        this.repository[index] = routing;
        return routing;
    }

    public async delete(routing: Routing): Promise<void> {
        const index = this.repository.findIndex((r) => r.getId() === routing.getId());
        this.repository.splice(index, 1);
    }

    public async findById(id: string): Promise<Routing | null> {
        return this.repository.find((r) => r.getId() === id) || null;
    }

    public async findAll({ name, gatewayId, page, limit }: { name?: string, gatewayId?: string, page?: number, limit?: number }): Promise<RoutingWithPagination> {
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

        const routingFiltered: RoutingList[] = filteredRoutings.map((routing) => {
            return {
                id: routing.getId(),
                name: routing.getName(),
                description: routing.getDescription(),
                gatewayId: routing.getGatewayId(),
                deletedAt: routing.getDeletedAt(),
            };
        });

        const result: RoutingWithPagination = {
            docs: routingFiltered,
            total: filteredRoutings.length,
            limit: limit || filteredRoutings.length,
            page: page || 1,
        };

        return result;
    }

    public clear() {
        this.repository = [];
    }
}