import { CreateGatewayUseCase } from "@/core/application/gateway/use-case/CreateGatewayUseCase";
import { Gateway } from "@/core/domain/gateway/entities/Gateway";
import { InMemoryGatewayReposiory } from "../repositories/InMemoryGatewayReposiory";
import { InMemoryUserRepository } from "../../user/repositories/InMemoryUserRepository";
import { CaslAbilityFactory } from "@/core/application/security/casl.factory";
import { userFactory } from "../../user/factories/userFactory";
import { v4 as uuidV4 } from "uuid";

const loggerMock = {
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
};

describe("CreateGatewayUseCase", () => {
  let useCase: CreateGatewayUseCase;
  let repo: InMemoryGatewayReposiory;
  let userRepo: InMemoryUserRepository;

  beforeEach(() => {
    vi.clearAllMocks();

    repo = new InMemoryGatewayReposiory();
    userRepo = new InMemoryUserRepository();

    const factory = new CaslAbilityFactory();

    useCase = new CreateGatewayUseCase(repo, userRepo, factory, loggerMock);

    repo.clear();
  });

  it("should be able to create a gateway", async () => {
    const fakeUser = userFactory({ role: "dev" });
    userRepo.save(fakeUser);

    const result = await useCase.execute({
      name: "Gateway 1",
      currentUserId: fakeUser.getId(),
      routes: Array.from({ length: 3 }, () => uuidV4()),
    });

    expect(result).toBeInstanceOf(Gateway);
  });

  it("should not be able to create a gateway if user does not have permission", async () => {
    const fakeUser = userFactory({ role: "user" });
    userRepo.save(fakeUser);

    await expect(() =>
      useCase.execute({ name: "Gateway 1", currentUserId: fakeUser.getId() }),
    ).rejects.toThrow("User does not have permission to perform this action");
  });
});
