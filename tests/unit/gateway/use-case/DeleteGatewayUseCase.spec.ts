import { DeleteGatewayUseCase } from "@/core/application/gateway/use-case/DeleteGatewayUseCase";
import { InMemoryGatewayReposiory } from "../repositories/InMemoryGatewayReposiory";
import { InMemoryUserRepository } from "../../user/repositories/InMemoryUserRepository";
import { CaslAbilityFactory } from "@/core/application/security/casl.factory";
import { gatewayFactory } from "../factories/gatewayFactory";
import { userFactory } from "../../user/factories/userFactory";

const loggerMock = {
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
};

describe("DeleteGatewayUseCase", () => {
  let useCase: DeleteGatewayUseCase;
  let repo: InMemoryGatewayReposiory;
  let userRepo: InMemoryUserRepository;

  beforeEach(() => {
    vi.clearAllMocks();

    repo = new InMemoryGatewayReposiory();
    userRepo = new InMemoryUserRepository();

    const factory = new CaslAbilityFactory();

    useCase = new DeleteGatewayUseCase(repo, userRepo, factory, loggerMock);

    repo.clear();
  });

  it("should delete a gateway", async () => {
    const gateway = gatewayFactory();
    repo.save(gateway);

    const user = userFactory({ role: "admin" });
    userRepo.save(user);

    await useCase.execute({
      currentUserId: user.getId(),
      gatewayId: gateway.getId(),
    });

    await expect(repo.findById(gateway.getId())).resolves.toBeNull();
  });

  it("should not delete a gateway if user does not have permission", async () => {
    const gateway = gatewayFactory();
    repo.save(gateway);

    const user = userFactory({ role: "user" });
    userRepo.save(user);

    await expect(() =>
      useCase.execute({
        currentUserId: user.getId(),
        gatewayId: gateway.getId(),
      }),
    ).rejects.toThrow("User does not have permission to perform this action");

    const gateway2 = gatewayFactory();
    repo.save(gateway2);

    const user2 = userFactory({ role: "dev" });
    userRepo.save(user2);

    await expect(() =>
      useCase.execute({
        currentUserId: user2.getId(),
        gatewayId: gateway2.getId(),
      }),
    ).rejects.toThrow("User does not have permission to perform this action");
  });
});
