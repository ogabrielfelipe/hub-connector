import { IRoutingRepository } from "@/core/domain/routing/repositories/IRoutingRepository";
import { IUserRepository } from "@/core/domain/user/repositories/IUserRepository";
import { CaslAbilityFactory } from "../../../security/casl.factory";
import { ILogger } from "../../../ports/logger.port";
import { Routing } from "@/core/domain/routing/entities/Routing";
import { Actions } from "../../../security/casl.types";
import UserNotFoundError from "@/core/domain/user/errors/UserNotFoundError";
import { NotPermissionError } from "../../../errors/NotPermissionError";
import { IGatewayRepository } from "@/core/domain/gateway/repositories/IGatewayRepository";
import GatewayNotFoundError from "@/core/domain/gateway/errors/GatewayNotFoundError";

interface CreateRoutingCaseCommand {
  currentUserId: string;
  name: string;
  slug: string;
  description: string;
  gatewayId: string;
  url: string;
  method: string;
  headers: Record<string, string>;
}

export class CreateRoutingUseCase {
  private routingRepository: IRoutingRepository;
  private gatewayRepository: IGatewayRepository;
  private userRepository: IUserRepository;
  private readonly abilityFactory: CaslAbilityFactory;
  private readonly logger: ILogger;

  constructor(
    routingRepository: IRoutingRepository,
    gatewayRepository: IGatewayRepository,
    userRepository: IUserRepository,
    abilityFactory: CaslAbilityFactory,
    logger: ILogger,
  ) {
    this.routingRepository = routingRepository;
    this.gatewayRepository = gatewayRepository;
    this.userRepository = userRepository;
    this.abilityFactory = abilityFactory;
    this.logger = logger;
  }

  public async execute(command: CreateRoutingCaseCommand): Promise<Routing> {
    const user = await this.userRepository.findById(command.currentUserId);
    if (!user) {
      this.logger.warn(`User ${command.currentUserId} does not exist`);
      throw new UserNotFoundError();
    }

    const ability = this.abilityFactory.createForUser(user);
    if (!ability.can(Actions.Create, "Routing")) {
      this.logger.warn(
        `User ${user.getUsername()} does not have permission to create a new routing`,
      );
      throw new NotPermissionError();
    }

    const gateway = await this.gatewayRepository.findById(command.gatewayId);
    if (!gateway) {
      this.logger.warn(`Gateway ${command.gatewayId} does not exist`);
      throw new GatewayNotFoundError();
    }

    const slug = command.slug.replace(" ", "-");

    const routing = Routing.createNew(
      command.name,
      slug,
      command.description,
      gateway.getId(),
      command.url,
      command.method,
      command.headers,
    );
    const result = await this.routingRepository.save(routing);
    return result;
  }
}
