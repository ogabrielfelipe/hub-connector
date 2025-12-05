import { UpdateGatewayUseCase } from "@/core/application/gateway/use-case/UpdateGatewayUseCase";
import { InMemoryGatewayReposiory } from "../repositories/InMemoryGatewayReposiory";
import { InMemoryUserRepository } from "../../user/repositories/InMemoryUserRepository";
import { CaslAbilityFactory } from "@/core/application/security/casl.factory";
import { Gateway } from "@/core/domain/gateway/entities/Gateway";
import { userFactory } from "../../user/factories/userFactory";

const loggerMock = {
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
};

describe("UpdateGatewayUseCase", () => {
  let useCase: UpdateGatewayUseCase;
  let repo: InMemoryGatewayReposiory;
  let userRepo: InMemoryUserRepository;

  beforeEach(() => {
    vi.clearAllMocks();

    repo = new InMemoryGatewayReposiory();
    userRepo = new InMemoryUserRepository();

    const factory = new CaslAbilityFactory();

    useCase = new UpdateGatewayUseCase(repo, userRepo, factory, loggerMock);

    repo.clear();
  });

  it("should update a gateway", async () => {
    const gateway = Gateway.createNew(
      "Gateway 1",
      "x-api-key",
      true,
      new Date(),
      new Date(),
    );
    await repo.save(gateway);

    const user = userFactory({ role: "dev" });
    await userRepo.save(user);

    const result = await useCase.execute({
      currentUserId: user.getId(),
      gatewayId: gateway.getId(),
      name: "Gateway 2",
      active: false,
      routes: ["/route1", "/route2"],
    });

    expect(result.getName()).toBe("Gateway 2");
    expect(result.getActive()).toBe(false);
    expect(result.getRoutes()).toHaveLength(2);
  });

  it("should not update a gateway if user does not have permission", async () => {
    const gateway = Gateway.createNew(
      "Gateway 1",
      "x-api-key",
      true,
      new Date(),
      new Date(),
    );
    await repo.save(gateway);

    const user = userFactory({ role: "user" });
    await userRepo.save(user);

    await expect(() =>
      useCase.execute({
        currentUserId: user.getId(),
        gatewayId: gateway.getId(),
        name: "Gateway 2",
        active: false,
        routes: ["/route1", "/route2"],
      }),
    ).rejects.toThrow("User does not have permission to perform this action");
  });
});
