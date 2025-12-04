import { IGatewayRepository } from "@/core/domain/gateway/repositories/IGatewayRepository";
import { IUserRepository } from "@/core/domain/user/repositories/IUserRepository";
import { CaslAbilityFactory } from "../../security/casl.factory";
import { ILogger } from "../../ports/logger.port";
import { Gateway } from "@/core/domain/gateway/entities/Gateway";
import UserNotFoundError from "@/core/domain/user/errors/UserNotFoundError";
import { Actions } from "../../security/casl.types";
import { NotPermissionError } from "../../errors/NotPermissionError";
import GatewayNotFoundError from "@/core/domain/gateway/errors/GatewayNotFoundError";


interface FindOneGatewayCaseCommand {
    currentUserId: string;
    gatewayId: string;
}

export class FindOneGatewayUseCase {
    private repository: IGatewayRepository;
    private userRepository: IUserRepository;
    private readonly abilityFactory: CaslAbilityFactory;
    private readonly logger: ILogger;

    constructor(
        repository: IGatewayRepository,
        userRepository: IUserRepository,
        abilityFactory: CaslAbilityFactory,
        logger: ILogger
    ) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.abilityFactory = abilityFactory;
        this.logger = logger;
    }

    async execute(command: FindOneGatewayCaseCommand): Promise<Gateway> {
        const currentUser = await this.userRepository.findById(command.currentUserId);
        if (!currentUser) {
            this.logger.warn(`User ${command.currentUserId} does not exist`);
            throw new UserNotFoundError();
        }
        const ability = this.abilityFactory.createForUser(currentUser);

        if (!ability.can(Actions.Read, "Gateway") || currentUser.getRole() === "user") {
            this.logger.warn(`User ${currentUser.getUsername()} does not have permission to read a gateway`);
            throw new NotPermissionError();
        }

        const gateway = await this.repository.findById(command.gatewayId);
        if (!gateway) {
            this.logger.warn(`Gateway ${command.gatewayId} does not exist`);
            throw new GatewayNotFoundError();
        }

        return gateway;
    }
}