import { FindAllRoutingUseCase } from "@/core/application/routing/use-case/FindAllRoutingUseCase";
import { InMemoryRoutingRepository } from "../repositories/InMemoryRoutingRepository";
import { routingFactory } from "../factories/routingFactory";


const loggerMock = {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
};

describe("FindAllRoutingUseCase", () => {
    let useCase: FindAllRoutingUseCase;
    let repo: InMemoryRoutingRepository;

    beforeEach(() => {
        vi.clearAllMocks();

        repo = new InMemoryRoutingRepository();

        useCase = new FindAllRoutingUseCase(repo, loggerMock);

        repo.clear();
    });

    it("should be able to find all routings", async () => {
        const routing = routingFactory({});
        await repo.save(routing);


        const result = await useCase.execute({
            gatewayId: routing.getGatewayId(),
            name: routing.getName(),
            page: 1,
            limit: 10,
        });

        expect(result).toBeDefined();
        expect(result.docs).toHaveLength(1);
        expect(result.docs[0].id).toBe(routing.getId());
    });

    it("should be able to find all routings with pagination", async () => {
        const routing = routingFactory({});
        await repo.save(routing);

        const routing2 = routingFactory({});
        await repo.save(routing2);

        const result = await useCase.execute({
            page: 1,
            limit: 1,
        });

        expect(result).toBeDefined();
        expect(result.docs).toHaveLength(1);
        expect(result.docs[0].id).toBe(routing.getId());

        const result2 = await useCase.execute({
            page: 2,
            limit: 1,
        });

        expect(result2).toBeDefined();
        expect(result2.docs).toHaveLength(1);
        expect(result2.docs[0].id).toBe(routing2.getId());
    });
});