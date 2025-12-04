import { GatewayDTO, IGatewayRepository } from "@/core/domain/gateway/repositories/IGatewayRepository";
import { Gateway } from "@/core/domain/gateway/entities/Gateway";


interface FindAllGatewayCaseCommand {
    name?: string;
    active?: boolean;
    page?: number;
    limit?: number;
}


export class FindAllGatewayUseCase {
    private repository: IGatewayRepository;

    constructor(
        repository: IGatewayRepository,
    ) {
        this.repository = repository;
    }


    async execute(command: FindAllGatewayCaseCommand): Promise<{ docs: GatewayDTO[], total: number, page: number, limit: number }> {
        const gateways = await this.repository.findAll(command);

        return gateways;
    }
}