
import { DashReportUseCase } from "@/core/application/report/dashReportUseCase";
import { IRoutingExecutionSearchRepository } from "@/core/domain/routing/repositories/IRoutingExecutionSearchRepository";
import { IRoutingRepository } from "@/core/domain/routing/repositories/IRoutingRepository";
import { FastifyReply, FastifyRequest } from "fastify";


export class ReportController {
    private dashReportUseCase: DashReportUseCase;


    constructor(searchRepository: IRoutingExecutionSearchRepository, routingRepository: IRoutingRepository) {
        this.dashReportUseCase = new DashReportUseCase({
            repositoryExecutionSearch: searchRepository,
            routingRepository
        });
    }

    async handle(req: FastifyRequest, reply: FastifyReply) {

        const result = await this.dashReportUseCase.execute();

        return reply.send(result);
    }
}
