import { SearchRoutingExecutionsUseCase } from "@/core/application/routing/use-case/search-execute-route/SearchRoutingExecutionsUseCase";
import { FastifyRequest, FastifyReply } from "fastify";
import { searchRoutingExecutionParamsSchema } from "../schemas/routingExecutionSchemas";
import { IRoutingExecutionSearchRepository } from "@/core/domain/routing/repositories/IRoutingExecutionSearchRepository";

export class SearchRoutingExecutionController {
  private searchRoutingExecutionsUseCase: SearchRoutingExecutionsUseCase;
  constructor(searchRepository: IRoutingExecutionSearchRepository) {
    this.searchRoutingExecutionsUseCase = new SearchRoutingExecutionsUseCase(
      searchRepository,
    );
  }

  async handle(req: FastifyRequest, reply: FastifyReply) {
    const {
      routingId,
      status,
      text,
      from,
      to,
      page = 1,
      perPage = 20,
      id
    } = searchRoutingExecutionParamsSchema.parse(req.query);

    const result = await this.searchRoutingExecutionsUseCase.execute({
      routingId,
      status,
      text,
      id,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
      page: page,
      perPage: perPage,
    });

    return reply.send(result);
  }
}
