import { DeleteUserUseCase } from "@/core/application/user/use-case/DeleteUserUseCase";
import { User, UserRole } from "@/core/domain/user/entities/User";
import { Email } from "@/core/domain/user/value-objects/Email";
import { InMemoryUserRepository } from "../repositories/InMemoryUserRepository";
import { CaslAbilityFactory } from "@/core/application/security/casl.factory";

const loggerMock = {
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
};

describe("DeleteUserUseCase", () => {
  const repo = new InMemoryUserRepository();
  let useCase: DeleteUserUseCase;
  const factory = new CaslAbilityFactory();

  beforeEach(() => {
    vi.clearAllMocks();

    useCase = new DeleteUserUseCase(repo, factory, loggerMock);
  });

  it("should be able to delete a user", async () => {
    const fakeUser = User.createNew(
      "John Doe",
      "john.doe",
      new Email("john.doe@hub.com"),
      UserRole.ADMIN,
      "123456",
    );

    repo.save(fakeUser);

    await useCase.execute(fakeUser.getId(), fakeUser.getId());
    expect(await repo.findById(fakeUser.getId())).toBeNull();
  });

  it("should not be able to delete a user if user does not have permission", async () => {
    const fakeUser = User.createNew(
      "John Doe",
      "john.doe",
      new Email("john.doe@hub.com"),
      UserRole.USER,
      "123456",
    );

    repo.save(fakeUser);

    await expect(() =>
      useCase.execute(fakeUser.getId(), fakeUser.getId()),
    ).rejects.toThrow("User does not have permission to perform this action");
  });

  it("should not be able to delete a user that does not exist", async () => {
    await expect(() => useCase.execute("1", "1")).rejects.toThrow(
      "User not found",
    );
  });
});
