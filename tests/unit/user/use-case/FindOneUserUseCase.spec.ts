import { FindOneUserUseCase } from "@/core/application/user/use-case/FindOneUserUseCase";
import { User, UserRole } from "@/core/domain/user/entities/User";
import { Email } from "@/core/domain/user/value-objects/Email";
import { InMemoryUserRepository } from "../repositories/InMemoryUserRepository";
import { CaslAbilityFactory } from "@/core/application/security/casl.factory";

const loggerMock = {
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
};

describe("FindOneUserUseCase", () => {
  const repo = new InMemoryUserRepository();
  let useCase: FindOneUserUseCase;
  const factory = new CaslAbilityFactory();

  beforeEach(() => {
    vi.clearAllMocks();

    useCase = new FindOneUserUseCase(repo, factory, loggerMock);
    repo.clear();
  });

  it("should be able to find a user by id", async () => {
    const fakeUser = User.createNew(
      "John Doe",
      "john.doe",
      new Email("john.doe@hub.com"),
      UserRole.USER,
      "123456",
    );

    repo.save(fakeUser);

    const result = await useCase.execute(fakeUser.getId(), fakeUser.getId());

    expect(result).toBe(fakeUser);
  });

  it("should not be able to find a user by id if user does not have permission", async () => {
    const fakeUser = User.createNew(
      "John Doe",
      "john.doe",
      new Email("john.doe@hub.com"),
      UserRole.USER,
      "123456",
    );

    const fakeUser2 = User.createNew(
      "John Doe",
      "john.doe",
      new Email("john.doe@hub.com"),
      UserRole.USER,
      "123456",
    );

    repo.save(fakeUser);
    repo.save(fakeUser2);

    await expect(() =>
      useCase.execute(fakeUser.getId(), fakeUser2.getId()),
    ).rejects.toThrow("User does not have permission to perform this action");
  });

  it("should not be able to find a user by id that does not exist", async () => {
    await expect(() => useCase.execute("1", "1")).rejects.toThrow(
      "User not found",
    );
  });
});
