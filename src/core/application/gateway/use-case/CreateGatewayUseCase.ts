import { Gateway } from "@/core/domain/gateway/entities/Gateway";
import { IGatewayRepository } from "@/core/domain/gateway/repositories/IGatewayRepository";
import { randomBytes } from "crypto";
import { v4 as uuidv4 } from "uuid";
import { IUserRepository } from "@/core/domain/user/repositories/IUserRepository";
import { CaslAbilityFactory } from "../../security/casl.factory";
import { ILogger } from "../../ports/logger.port";
import { Actions } from "../../security/casl.types";
import { NotPermissionError } from "../../errors/NotPermissionError";
import UserNotFoundError from "@/core/domain/user/errors/UserNotFoundError";

interface CreateGatewayCaseCommand {
  currentUserId: string;
  name: string;
  routes?: string[];
}

export class CreateGatewayUseCase {
  private repository: IGatewayRepository;
  private userRepository: IUserRepository;
  private readonly abilityFactory: CaslAbilityFactory;
  private readonly logger: ILogger;

  constructor(
    repository: IGatewayRepository,
    userRepository: IUserRepository,
    abilityFactory: CaslAbilityFactory,
    logger: ILogger,
  ) {
    this.repository = repository;
    this.userRepository = userRepository;
    this.abilityFactory = abilityFactory;
    this.logger = logger;
  }

  async execute(command: CreateGatewayCaseCommand): Promise<Gateway> {
    const currentUser = await this.userRepository.findById(
      command.currentUserId,
    );
    if (!currentUser) {
      this.logger.warn(`User ${command.currentUserId} does not exist`);
      throw new UserNotFoundError();
    }
    const ability = this.abilityFactory.createForUser(currentUser);

    if (!ability.can(Actions.Create, "Gateway")) {
      this.logger.warn(
        `User ${currentUser.getUsername()} does not have permission to create a new gateway`,
      );
      throw new NotPermissionError();
    }

    const xApiKey = Buffer.from(randomBytes(64).toString("base64")).toString(
      "base64",
    );

    const routes = command.routes?.map((route) => ({
      id: uuidv4(),
      path: route,
      destination: route,
    }));

    const gateway = Gateway.createNew(
      command.name,
      xApiKey,
      true,
      new Date(),
      new Date(),
      routes,
    );
    return this.repository.save(gateway);
  }
}
