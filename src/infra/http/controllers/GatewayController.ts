import { type FastifyRequest, type FastifyReply } from "fastify";
import { CaslAbilityFactory } from "@/core/application/security/casl.factory";
import { IGatewayRepository } from "@/core/domain/gateway/repositories/IGatewayRepository";
import { IUserRepository } from "@/core/domain/user/repositories/IUserRepository";
import { ILogger } from "@/core/application/ports/logger.port";
import { CreateGatewaySchema, DeleteGatewaySchema, FindAllGatewaySchema, FindOneGatewaySchema, UpdateGatewayParamsSchema, UpdateGatewaySchema } from "../schemas/gatewaySchemas";
import { CreateGatewayUseCase } from "@/core/application/gateway/use-case/CreateGatewayUseCase";
import { FindOneGatewayUseCase } from "@/core/application/gateway/use-case/FindOneGatewayUseCase";
import { FindAllGatewayUseCase } from "@/core/application/gateway/use-case/FindAllGatewayUseCase";
import { UpdateGatewayUseCase } from "@/core/application/gateway/use-case/UpdateGatewayUseCase";
import { DeleteGatewayUseCase } from "@/core/application/gateway/use-case/DeleteGatewayUseCase";


export class GatewayController {

    private createGatewayUseCase: CreateGatewayUseCase;
    private findOneGatewayUseCase: FindOneGatewayUseCase;
    private findAllGatewayUseCase: FindAllGatewayUseCase;
    private updateGatewayUseCase: UpdateGatewayUseCase;
    private deleteGatewayUseCase: DeleteGatewayUseCase;

    constructor(gatewayRepository: IGatewayRepository, userRepository: IUserRepository, caslAbilityFactory: CaslAbilityFactory, logger: ILogger) {
        this.createGatewayUseCase = new CreateGatewayUseCase(gatewayRepository, userRepository, caslAbilityFactory, logger);
        this.findOneGatewayUseCase = new FindOneGatewayUseCase(gatewayRepository, userRepository, caslAbilityFactory, logger);
        this.findAllGatewayUseCase = new FindAllGatewayUseCase(gatewayRepository);
        this.updateGatewayUseCase = new UpdateGatewayUseCase(gatewayRepository, userRepository, caslAbilityFactory, logger);
        this.deleteGatewayUseCase = new DeleteGatewayUseCase(gatewayRepository, userRepository, caslAbilityFactory, logger);
    }


    async createGateway(req: FastifyRequest, reply: FastifyReply) {
        const body = CreateGatewaySchema.parse(req.body);
        const currentUser = req.user;

        const result = await this.createGatewayUseCase.execute({ currentUserId: currentUser!.userId, name: body.name, routes: body.routes });
        return reply.status(201).send(result);
    }

    async findOneGateway(req: FastifyRequest, reply: FastifyReply) {
        const gatewayId = FindOneGatewaySchema.parse(req.params);
        const currentUser = req.user;

        const result = await this.findOneGatewayUseCase.execute({ currentUserId: currentUser!.userId, gatewayId: gatewayId.gatewayId });
        return reply.status(200).send(result);
    }

    async findAllGateway(req: FastifyRequest, reply: FastifyReply) {
        const query = FindAllGatewaySchema.parse(req.query) ?? {};

        const result = await this.findAllGatewayUseCase.execute(query);
        return reply.status(200).send(result);
    }

    async updateGateway(req: FastifyRequest, reply: FastifyReply) {
        const body = UpdateGatewaySchema.parse(req.body);
        const currentUser = req.user;
        const { gatewayId } = UpdateGatewayParamsSchema.parse(req.params);

        const result = await this.updateGatewayUseCase.execute({ currentUserId: currentUser!.userId, gatewayId, name: body.name, active: body.active, routes: body.routes });
        return reply.status(200).send(result);
    }

    async deleteGateway(req: FastifyRequest, reply: FastifyReply) {
        const gatewayId = DeleteGatewaySchema.parse(req.params);
        const currentUser = req.user;

        const result = await this.deleteGatewayUseCase.execute({ currentUserId: currentUser!.userId, gatewayId: gatewayId.gatewayId });
        return reply.status(200).send(result);
    }
}