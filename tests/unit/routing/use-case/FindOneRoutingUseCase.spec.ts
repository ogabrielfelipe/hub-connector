import { FindOneRoutingUseCase } from "@/core/application/routing/use-case/FindOneRoutingUseCase";
import { InMemoryRoutingRepository } from "../repositories/InMemoryRoutingRepository";
import { InMemoryUserRepository } from "../../user/repositories/InMemoryUserRepository";
import { CaslAbilityFactory } from "@/core/application/security/casl.factory";
import { userFactory } from "../../user/factories/userFactory";
import { routingFactory } from "../factories/routingFactory";
import { NotPermissionError } from "@/core/application/errors/NotPermissionError";
import { InMemoryGatewayReposiory } from "../../gateway/repositories/InMemoryGatewayReposiory";
import { gatewayFactory } from "../../gateway/factories/gatewayFactory";

const loggerMock = {
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
};

describe("FindOneRoutingUseCase", () => {
  let useCase: FindOneRoutingUseCase;
  let repo: InMemoryRoutingRepository;
  let userRepo: InMemoryUserRepository;
  let gatewayRepo: InMemoryGatewayReposiory;

  beforeEach(() => {
    vi.clearAllMocks();

    userRepo = new InMemoryUserRepository();
    gatewayRepo = new InMemoryGatewayReposiory();
    repo = new InMemoryRoutingRepository(gatewayRepo);

    const factory = new CaslAbilityFactory();

    useCase = new FindOneRoutingUseCase(repo, userRepo, factory, loggerMock);

    repo.clear();
  });

  it("should be able to find a routing", async () => {
    const user = userFactory({ role: "admin" });
    userRepo.save(user);

    const gateway = gatewayFactory({});
    gatewayRepo.save(gateway);

    const routing = routingFactory({ gatewayId: gateway.getId() });
    repo.save(routing);

    const result = await useCase.execute({
      currentUserId: user.getId(),
      routingId: routing.getId(),
    });

    expect(result).toBeDefined();
    expect(result?.getId()).toBe(routing.getId());
  });

  it("should not be able to find a routing", async () => {
    const user = userFactory({ role: "user" });
    userRepo.save(user);

    const routing = routingFactory({});
    repo.save(routing);

    await expect(
      useCase.execute({
        currentUserId: user.getId(),
        routingId: routing.getId(),
      }),
    ).rejects.toThrow(NotPermissionError);
  });
});
