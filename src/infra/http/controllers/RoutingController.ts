import { CreateRoutingUseCase } from "@/core/application/routing/use-case/CreateRoutingUseCase";
import { DeleteRoutingUseCase } from "@/core/application/routing/use-case/DeleteRoutingUseCase";
import { FindAllRoutingUseCase } from "@/core/application/routing/use-case/FindAllRoutingUseCase";
import { FindOneRoutingUseCase } from "@/core/application/routing/use-case/FindOneRoutingUseCase";
import { UpdateRoutingUseCase } from "@/core/application/routing/use-case/UpdateRoutingUseCase";
import {
  CreateRoutingSchema,
  FindAllRoutingSchema,
  FindOneRoutingSchema,
  UpdateRoutingSchema,
} from "../schemas/routingSchemas";
import { FastifyReply, FastifyRequest } from "fastify";
import { IGatewayRepository } from "@/core/domain/gateway/repositories/IGatewayRepository";
import { IUserRepository } from "@/core/domain/user/repositories/IUserRepository";
import { CaslAbilityFactory } from "@/core/application/security/casl.factory";
import { ILogger } from "@/core/application/ports/logger.port";
import { IRoutingRepository } from "@/core/domain/routing/repositories/IRoutingRepository";

export class RoutingController {
  private createRoutingUseCase: CreateRoutingUseCase;
  private deleteRoutingUseCase: DeleteRoutingUseCase;
  private findOneRoutingUseCase: FindOneRoutingUseCase;
  private findAllRoutingUseCase: FindAllRoutingUseCase;
  private updateRoutingUseCase: UpdateRoutingUseCase;

  constructor(
    routingRepository: IRoutingRepository,
    gatewayRepository: IGatewayRepository,
    userRepository: IUserRepository,
    caslAbilityFactory: CaslAbilityFactory,
    logger: ILogger,
  ) {
    this.createRoutingUseCase = new CreateRoutingUseCase(
      routingRepository,
      gatewayRepository,
      userRepository,
      caslAbilityFactory,
      logger,
    );
    this.deleteRoutingUseCase = new DeleteRoutingUseCase(
      routingRepository,
      userRepository,
      caslAbilityFactory,
      logger,
    );
    this.findOneRoutingUseCase = new FindOneRoutingUseCase(
      routingRepository,
      userRepository,
      caslAbilityFactory,
      logger,
    );
    this.findAllRoutingUseCase = new FindAllRoutingUseCase(
      routingRepository,
      logger,
    );
    this.updateRoutingUseCase = new UpdateRoutingUseCase(
      routingRepository,
      userRepository,
      caslAbilityFactory,
      logger,
    );
  }

  public async create(req: FastifyRequest, reply: FastifyReply) {
    const body = CreateRoutingSchema.parse(req.body);
    const currentUserId = req.user?.userId;

    const result = await this.createRoutingUseCase.execute({
      currentUserId: currentUserId!,
      ...body,
    });
    return reply.status(201).send(result);
  }

  public async update(req: FastifyRequest, reply: FastifyReply) {
    const body = UpdateRoutingSchema.parse(req.body);
    const { routingId } = FindOneRoutingSchema.parse(req.params);
    const currentUserId = req.user?.userId;

    const result = await this.updateRoutingUseCase.execute({
      currentUserId: currentUserId!,
      routingId: routingId,
      ...body,
    });
    return reply.status(200).send(result);
  }

  public async delete(req: FastifyRequest, reply: FastifyReply) {
    const { routingId } = FindOneRoutingSchema.parse(req.params);
    const currentUserId = req.user?.userId;

    const result = await this.deleteRoutingUseCase.execute({
      currentUserId: currentUserId!,
      routingId: routingId,
    });
    return reply.status(204).send(result);
  }

  public async findOne(req: FastifyRequest, reply: FastifyReply) {
    const { routingId } = FindOneRoutingSchema.parse(req.params);
    const currentUserId = req.user?.userId;

    const result = await this.findOneRoutingUseCase.execute({
      currentUserId: currentUserId!,
      routingId: routingId,
    });
    return reply.status(200).send(result);
  }

  public async findAll(req: FastifyRequest, reply: FastifyReply) {
    const body = FindAllRoutingSchema.parse(req.query);

    const result = await this.findAllRoutingUseCase.execute(body);
    return reply.status(200).send(result);
  }
}
