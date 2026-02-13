import { IRoutingExecutionSearchRepository } from "@/core/domain/routing/repositories/IRoutingExecutionSearchRepository";
import { IRoutingRepository } from "@/core/domain/routing/repositories/IRoutingRepository";
import { subDays } from "date-fns";


interface DashReportUseCaseProps {
    routingRepository: IRoutingRepository;
    repositoryExecutionSearch: IRoutingExecutionSearchRepository;
}

export class DashReportUseCase {
    private routingRepository: IRoutingRepository;
    private repositoryExecutionSearch: IRoutingExecutionSearchRepository;

    private readonly DEFAULT_PAGE = 1;
    private readonly DEFAULT_PER_PAGE = 10000;

    constructor(private props: DashReportUseCaseProps) {
        this.routingRepository = props.routingRepository;
        this.repositoryExecutionSearch = props.repositoryExecutionSearch;
    }

    async execute() {
        const totalRoutes = await this.routingRepository.findAll({ page: this.DEFAULT_PAGE, limit: this.DEFAULT_PER_PAGE });
        const totalConnectorExecutions = await this.repositoryExecutionSearch.search({ from: subDays(new Date(), 1), to: new Date(), page: this.DEFAULT_PAGE, perPage: this.DEFAULT_PER_PAGE });

        console.log({ from: subDays(new Date(), 1), to: new Date(), page: this.DEFAULT_PAGE, perPage: this.DEFAULT_PER_PAGE })


        const percentErrorPerRoute = totalConnectorExecutions.items.reduce((acc, item) => {
            console.log(item)
            if (item.statusReturnAPI !== 200) {
                const route = totalRoutes.docs.find((route) => route.id === item.routingId);
                if (route) {
                    acc[route.name] = (acc[route.name] || 0) + 1;
                }
            }
            return acc;
        }, {} as Record<string, number>);

        const trafficPerRoute = totalConnectorExecutions.items.reduce((acc, item) => {
            const route = totalRoutes.docs.find((route) => route.id === item.routingId);
            if (route) {
                acc[route.name] = (acc[route.name] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);


        const latency_average = totalConnectorExecutions.items.reduce((acc, item) => acc + item.latency, 0) / totalConnectorExecutions.total;

        console.log({
            total_routes: totalRoutes.total,
            requests_today: totalConnectorExecutions.total,
            latency_average: isNaN(latency_average) ? 0 : latency_average,
            percent_error_per_route: percentErrorPerRoute,
            traffic_per_route: trafficPerRoute,
        })

        return {
            total_routes: totalRoutes.total,
            requests_today: totalConnectorExecutions.total,
            latency_average: isNaN(latency_average) ? 0 : latency_average,
            percent_error_per_route: percentErrorPerRoute,
            traffic_per_route: trafficPerRoute,
        };
    }
}