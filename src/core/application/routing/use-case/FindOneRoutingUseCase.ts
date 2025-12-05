import { IRoutingRepository } from "@/core/domain/routing/repositories/IRoutingRepository";
import { IUserRepository } from "@/core/domain/user/repositories/IUserRepository";
import { CaslAbilityFactory } from "../../security/casl.factory";
import { ILogger } from "../../ports/logger.port";
import { Routing } from "@/core/domain/routing/entities/Routing";
import UserNotFoundError from "@/core/domain/user/errors/UserNotFoundError";
import { Actions } from "../../security/casl.types";
import { NotPermissionError } from "../../errors/NotPermissionError";
import RoutingNotFoundError from "@/core/domain/routing/errors/RoutingNotFoundError";


interface FindOneRoutingUseCaseCommand {
    currentUserId: string;
    routingId: string;
}


export class FindOneRoutingUseCase {
    private routingRepository: IRoutingRepository;
    private userRepository: IUserRepository;
    private readonly abilityFactory: CaslAbilityFactory;
    private readonly logger: ILogger;

    constructor(routingRepository: IRoutingRepository, userRepository: IUserRepository, abilityFactory: CaslAbilityFactory, logger: ILogger) {
        this.routingRepository = routingRepository;
        this.userRepository = userRepository;
        this.abilityFactory = abilityFactory;
        this.logger = logger;
    }

    public async execute(command: FindOneRoutingUseCaseCommand): Promise<Routing> {
        const user = await this.userRepository.findById(command.currentUserId);
        if (!user) {
            this.logger.warn(`User ${command.currentUserId} does not exist`);
            throw new UserNotFoundError();
        }

        const ability = this.abilityFactory.createForUser(user);
        if (!ability.can(Actions.Read, "Routing")) {
            this.logger.warn(
                `User ${user.getUsername()} does not have permission to read a routing`,
            );
            throw new NotPermissionError();
        }

        const routing = await this.routingRepository.findById(command.routingId);
        if (!routing) {
            this.logger.warn(`Routing ${command.routingId} does not exist`);
            throw new RoutingNotFoundError();
        }

        return routing;
    }
}