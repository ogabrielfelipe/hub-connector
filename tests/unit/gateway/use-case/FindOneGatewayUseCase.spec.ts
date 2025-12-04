import { FindOneGatewayUseCase } from "@/core/application/gateway/use-case/FindOneGatewayUseCase";
import { InMemoryGatewayReposiory } from "../repositories/InMemoryGatewayReposiory";
import { InMemoryUserRepository } from "../../user/repositories/InMemoryUserRepository";
import { CaslAbilityFactory } from "@/core/application/security/casl.factory";
import { gatewayFactory } from "../factories/gatewayFactory";
import { userFactory } from "../../user/factories/userFactory";



const loggerMock = {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn()
}



describe("FindOneGatewayUseCase", () => {
    let useCase: FindOneGatewayUseCase;
    let repo: InMemoryGatewayReposiory;
    let userRepo: InMemoryUserRepository;

    beforeEach(() => {
        vi.clearAllMocks();

        repo = new InMemoryGatewayReposiory();
        userRepo = new InMemoryUserRepository();

        const factory = new CaslAbilityFactory();

        useCase = new FindOneGatewayUseCase(repo, userRepo, factory, loggerMock);

        repo.clear();
    });

    it("should find a gateway by id", async () => {
        const gateway = gatewayFactory();
        await repo.save(gateway);

        const user = userFactory({ role: "dev" });
        await userRepo.save(user);

        const result = await useCase.execute({
            currentUserId: user.getId(),
            gatewayId: gateway.getId()
        });

        expect(result).toEqual(gateway);
    });

    it("should not find a gateway by id if user does not have permission", async () => {
        const gateway = gatewayFactory();
        await repo.save(gateway);

        const user = userFactory({ role: "user" });
        await userRepo.save(user);

        await expect(() => useCase.execute({
            currentUserId: user.getId(),
            gatewayId: gateway.getId()
        })).rejects.toThrow("User does not have permission to perform this action");
    });
})