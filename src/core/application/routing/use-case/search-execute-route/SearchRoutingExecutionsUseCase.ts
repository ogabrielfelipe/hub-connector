import { IRoutingExecutionSearchRepository, RoutingExecutionSearchParams } from "@/core/domain/routing/repositories/IRoutingExecutionSearchRepository";



export class SearchRoutingExecutionsUseCase {
    private routingExecutionSearchRepository: IRoutingExecutionSearchRepository;
    constructor(
        routingExecutionSearchRepository: IRoutingExecutionSearchRepository,
    ) {
        this.routingExecutionSearchRepository = routingExecutionSearchRepository;
    }

    async execute(params: RoutingExecutionSearchParams) {
        return this.routingExecutionSearchRepository.search(params);
    }
}