import {
  IRoutingRepository,
  RoutingWithPagination,
} from "@/core/domain/routing/repositories/IRoutingRepository";
import { ILogger } from "../../../ports/logger.port";

interface FindAllRoutingUseCaseCommand {
  gatewayId?: string;
  name?: string;
  slug?: string;
  page: number;
  limit: number;
}

export class FindAllRoutingUseCase {
  private routingRepository: IRoutingRepository;
  private readonly logger: ILogger;

  constructor(routingRepository: IRoutingRepository, logger: ILogger) {
    this.routingRepository = routingRepository;
    this.logger = logger;
  }

  public async execute(
    command: FindAllRoutingUseCaseCommand,
  ): Promise<RoutingWithPagination> {
    const routing = await this.routingRepository.findAll({
      gatewayId: command.gatewayId,
      name: command.name,
      slug: command.slug,
      page: command.page ?? 1,
      limit: command.limit ?? 10,
    });
    return routing;
  }
}
