import { CreateRoutingExecutionUseCase } from "@/core/application/routing/use-case/execute-route/CreateRoutingExecutionUseCase";
import { IRoutingExecutionRepository } from "@/core/domain/routing/repositories/IRoutingExecutionRepository";
import { IRoutingRepository } from "@/core/domain/routing/repositories/IRoutingRepository";
import { FastifyReply, FastifyRequest } from "fastify";
import { createRoutingExecutionParamsSchema, createRoutingExecutionSchema } from "../schemas/routingExecutionSchemas";


export class RoutingExecutionController {
    private createRoutingExecutionUseCase: CreateRoutingExecutionUseCase;

    constructor(
        routingRepository: IRoutingRepository,
        routingExecutionRepository: IRoutingExecutionRepository,
    ) {
        this.createRoutingExecutionUseCase = new CreateRoutingExecutionUseCase(routingExecutionRepository, routingRepository);
    }

    async handle(req: FastifyRequest, reply: FastifyReply) {
        const { routingSlug } = createRoutingExecutionParamsSchema.parse(req.params);
        const body = createRoutingExecutionSchema.parse(req.body);

        const result = await this.createRoutingExecutionUseCase.execute({
            routingSlug,
            payload: body,
        });
        return reply.status(201).send(result);
    }
}