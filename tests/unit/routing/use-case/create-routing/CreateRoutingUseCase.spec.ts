import { InMemoryGatewayReposiory } from "../../../gateway/repositories/InMemoryGatewayReposiory";
import { InMemoryUserRepository } from "../../../user/repositories/InMemoryUserRepository";
import { CreateRoutingUseCase } from "@/core/application/routing/use-case/create-routing/CreateRoutingUseCase";
import { CaslAbilityFactory } from "@/core/application/security/casl.factory";
import { InMemoryRoutingRepository } from "../../repositories/InMemoryRoutingRepository";
import { userFactory } from "../../../user/factories/userFactory";
import { gatewayFactory } from "../../../gateway/factories/gatewayFactory";
import { NotPermissionError } from "@/core/application/errors/NotPermissionError";

const loggerMock = {
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
};

describe("CreateRoutingUseCase", () => {
  let useCase: CreateRoutingUseCase;
  let repo: InMemoryRoutingRepository;
  let userRepo: InMemoryUserRepository;
  let gatewayRepo: InMemoryGatewayReposiory;

  beforeEach(() => {
    vi.clearAllMocks();

    gatewayRepo = new InMemoryGatewayReposiory();
    repo = new InMemoryRoutingRepository(gatewayRepo);
    userRepo = new InMemoryUserRepository();

    const factory = new CaslAbilityFactory();

    useCase = new CreateRoutingUseCase(
      repo,
      gatewayRepo,
      userRepo,
      factory,
      loggerMock,
    );

    repo.clear();
  });

  it("should be able to create a new Routing", async () => {
    const user = userFactory({ role: "admin" });
    userRepo.save(user);

    const gateway = gatewayFactory({});
    gatewayRepo.save(gateway);

    const routing = await useCase.execute({
      currentUserId: user.getId(),
      name: "test",
      slug: "test",
      description: "test",
      gatewayId: gateway.getId(),
      url: "https://example.test",
      method: "GET",
      headers: {},
    });

    expect(routing).toBeDefined();
  });

  it("should not be able to create a new Routing", async () => {
    const user = userFactory({ role: "user" });
    userRepo.save(user);

    const gateway = gatewayFactory({});
    gatewayRepo.save(gateway);

    await expect(
      useCase.execute({
        currentUserId: user.getId(),
        name: "test",
        slug: "test",
        description: "test",
        gatewayId: gateway.getId(),
        url: "test",
        method: "GET",
        headers: {},
      }),
    ).rejects.toThrow(NotPermissionError);
  });
});
