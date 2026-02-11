import { FindAllUsersUseCase } from "@/core/application/user/use-case/FindAllUsersUseCase";
import { User, UserRole } from "@/core/domain/user/entities/User";
import { Email } from "@/core/domain/user/value-objects/Email";
import { InMemoryUserRepository } from "../repositories/InMemoryUserRepository";
import { CaslAbilityFactory } from "@/core/application/security/casl.factory";

const loggerMock = {
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
};

describe("FindAllUsersUseCase", () => {
  const repo = new InMemoryUserRepository();

  let useCase: FindAllUsersUseCase;
  const factory = new CaslAbilityFactory();

  beforeEach(() => {
    vi.clearAllMocks();

    repo.clear();

    useCase = new FindAllUsersUseCase(repo, factory, loggerMock);
  });

  it("should be able to find all users", async () => {
    const fakeUser = User.createNew(
      "John Doe",
      "john.doe",
      new Email("john.doe@hub.com"),
      UserRole.USER,
      "123456",
    );

    repo.save(fakeUser);

    const result = await useCase.execute(
      { filters: {}, limit: 10, page: 1 },
      fakeUser.getId(),
    );

    expect(result.docs).toHaveLength(1);
    expect(result.docs[0]).toBe(fakeUser);

    expect(result.docs).toEqual(expect.arrayContaining([fakeUser]));
  });

  it("should be able to find all users with filters", async () => {
    const fakeUser = User.createNew(
      "John Doe",
      "john.doe",
      new Email("john.doe@hub.com"),
      UserRole.USER,
      "123456",
    );

    const fakeUser2 = User.createNew(
      "James Doe",
      "james.doe",
      new Email("james.doe@hub.com"),
      UserRole.USER,
      "123456",
    );

    repo.save(fakeUser);
    repo.save(fakeUser2);

    const result = await useCase.execute(
      {
        filters: { username: "john.doe" },
        limit: 10,
        page: 1,
      },
      fakeUser.getId(),
    );

    expect(result.docs).toHaveLength(1);
    expect(result.docs[0].getUsername()).toBe(fakeUser.getUsername());

    expect(result.docs).toEqual(expect.arrayContaining([fakeUser]));
  });

  it("should be able to find all users with pagination", async () => {
    const fakeUser = User.createNew(
      "John Doe",
      "john.doe",
      new Email("john.doe@hub.com"),
      UserRole.USER,
      "123456",
    );
    const fakeUser2 = User.createNew(
      "John Doe 2",
      "john.doe2",
      new Email("john.doe2@hub.com"),
      UserRole.USER,
      "123456",
    );

    const fakeAdmin = User.createNew(
      "John Doe",
      "john.doe",
      new Email("john.doe@hub.com"),
      UserRole.ADMIN,
      "123456",
    );

    repo.save(fakeUser);
    repo.save(fakeUser2);
    repo.save(fakeAdmin);

    const result = await useCase.execute(
      { filters: {}, limit: 1, page: 1 },
      fakeAdmin.getId(),
    );

    expect(result.docs).toHaveLength(1);
    expect(result.docs[0]).toBe(fakeUser);

    expect(result.docs).toEqual(expect.arrayContaining([fakeUser]));

    const result2 = await useCase.execute(
      { filters: {}, limit: 1, page: 2 },
      fakeAdmin.getId(),
    );

    expect(result2.docs).toHaveLength(1);
    expect(result2.docs[0]).toBe(fakeUser2);

    expect(result2.docs).toEqual(expect.arrayContaining([fakeUser2]));
  });
});
