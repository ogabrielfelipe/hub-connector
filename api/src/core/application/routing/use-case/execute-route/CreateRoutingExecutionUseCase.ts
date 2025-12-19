import {
  RoutingExecution,
  RoutingExecutionStatus,
} from "@/core/domain/routing/entities/RoutingEcxecution";
import RoutingNotFoundError from "@/core/domain/routing/errors/RoutingNotFoundError";
import { IRoutingExecutionRepository } from "@/core/domain/routing/repositories/IRoutingExecutionRepository";
import { IRoutingRepository } from "@/core/domain/routing/repositories/IRoutingRepository";

interface CreateRoutingExecutionUseCaseCommand {
  routingSlug: string;
  payload?: unknown;
  params?: Record<string, unknown>;
}

export class CreateRoutingExecutionUseCase {
  private routingExecutionRepository: IRoutingExecutionRepository;
  private routingRepository: IRoutingRepository;

  constructor(
    routingExecutionRepository: IRoutingExecutionRepository,
    routingRepository: IRoutingRepository,
  ) {
    this.routingExecutionRepository = routingExecutionRepository;
    this.routingRepository = routingRepository;
  }

  public async execute(command: CreateRoutingExecutionUseCaseCommand) {
    const routing = await this.routingRepository.findOneBySlug(
      command.routingSlug,
    );
    if (!routing) {
      throw new RoutingNotFoundError();
    }

    const routingExecution = RoutingExecution.create(
      routing.getId(),
      RoutingExecutionStatus.PENDING,
      [],
      command.params,
      command.payload,
      undefined,
      undefined,
      null,
    );

    return this.routingExecutionRepository.save(routingExecution);
  }
}
