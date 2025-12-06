import { DeleteRoutingUseCase } from "@/core/application/routing/use-case/DeleteRoutingUseCase";
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

describe("DeleteRoutingUseCase", () => {
  let useCase: DeleteRoutingUseCase;
  let repo: InMemoryRoutingRepository;
  let userRepo: InMemoryUserRepository;
  let gatewayRepo: InMemoryGatewayReposiory;

  beforeEach(() => {
    vi.clearAllMocks();

    gatewayRepo = new InMemoryGatewayReposiory();
    repo = new InMemoryRoutingRepository(gatewayRepo);
    userRepo = new InMemoryUserRepository();

    const factory = new CaslAbilityFactory();

    useCase = new DeleteRoutingUseCase(repo, userRepo, factory, loggerMock);

    repo.clear();
  });

  it("should be able to delete a routing existing", async () => {
    const user = userFactory({ role: "admin" });
    userRepo.save(user);

    const gateway = gatewayFactory({});
    gatewayRepo.save(gateway);

    const routing = routingFactory({ gatewayId: gateway.getId() });
    repo.save(routing);

    await useCase.execute({
      currentUserId: user.getId(),
      routingId: routing.getId(),
    });

    await expect(repo.findById(routing.getId())).resolves.toBeNull();
  });

  it("should not be able to delete a routing not existing", async () => {
    const user = userFactory({ role: "user" });
    userRepo.save(user);

    await expect(
      useCase.execute({
        currentUserId: user.getId(),
        routingId: "123",
      }),
    ).rejects.toThrow(NotPermissionError);

    const user2 = userFactory({ role: "dev" });
    userRepo.save(user2);

    const gateway = gatewayFactory({});
    gatewayRepo.save(gateway);

    const routing = routingFactory({ gatewayId: gateway.getId() });
    repo.save(routing);

    await expect(
      useCase.execute({
        currentUserId: user2.getId(),
        routingId: routing.getId(),
      }),
    ).rejects.toThrow(NotPermissionError);
  });
});
