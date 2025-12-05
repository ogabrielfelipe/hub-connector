import { UpdateRoutingUseCase } from "@/core/application/routing/use-case/UpdateRoutingUseCase";
import { InMemoryRoutingRepository } from "../repositories/InMemoryRoutingRepository";
import { InMemoryUserRepository } from "../../user/repositories/InMemoryUserRepository";
import { InMemoryGatewayReposiory } from "../../gateway/repositories/InMemoryGatewayReposiory";
import { CaslAbilityFactory } from "@/core/application/security/casl.factory";
import { userFactory } from "../../user/factories/userFactory";
import { gatewayFactory } from "../../gateway/factories/gatewayFactory";
import { routingFactory } from "../factories/routingFactory";
import { NotPermissionError } from "@/core/application/errors/NotPermissionError";

const loggerMock = {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
};


describe("UpdateRoutingUseCase", () => {
    let useCase: UpdateRoutingUseCase;
    let repo: InMemoryRoutingRepository;
    let userRepo: InMemoryUserRepository;
    let gatewayRepo: InMemoryGatewayReposiory;

    beforeEach(() => {
        vi.clearAllMocks();

        gatewayRepo = new InMemoryGatewayReposiory();
        repo = new InMemoryRoutingRepository();
        userRepo = new InMemoryUserRepository();

        const factory = new CaslAbilityFactory();

        useCase = new UpdateRoutingUseCase(repo, userRepo, factory, loggerMock);

        repo.clear();
    });


    it('should be able to update a Routing', async () => {
        const user = userFactory({ role: "admin" });
        userRepo.save(user);

        const gateway = gatewayFactory({});
        gatewayRepo.save(gateway);

        const routing = routingFactory({ gatewayId: gateway.getId() });
        repo.save(routing);

        const updatedRouting = await useCase.execute({
            currentUserId: user.getId(),
            routingId: routing.getId(),
            name: "Updated Name",
            description: "Updated Description"
        })

        expect(updatedRouting).toBeDefined();
        expect(updatedRouting.getName()).toBe("Updated Name");
        expect(updatedRouting.getDescription()).toBe("Updated Description");
    })

    it('should not be able to update a Routing', async () => {
        const user = userFactory({ role: "user" });
        userRepo.save(user);

        const gateway = gatewayFactory({});
        gatewayRepo.save(gateway);

        const routing = routingFactory({ gatewayId: gateway.getId() });
        repo.save(routing);

        await expect(useCase.execute({
            currentUserId: user.getId(),
            routingId: routing.getId(),
            name: "Updated Name",
            description: "Updated Description"
        })).rejects.toThrow(NotPermissionError);
    })
});