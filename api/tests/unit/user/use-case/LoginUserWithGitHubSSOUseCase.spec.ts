import { LoginUserWithGitHubSSOUseCase } from "@/core/application/user/use-case/LoginUserWithGitHubSSOUseCase";

const userRepositoryMock = {
  findByUsername: vi.fn(),
  save: vi.fn(),
  findById: vi.fn(),
  findByEmail: vi.fn(),
  findByProviderIdOrEmail: vi.fn(),
  findAll: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

const tokenGeneratorMock = {
  verify: vi.fn(),
  generate: vi.fn(() => "token-access"),
};

describe("LoginUserWithGitHubSSOUseCase", () => {
  let useCase: LoginUserWithGitHubSSOUseCase;

  beforeEach(() => {
    vi.clearAllMocks();

    useCase = new LoginUserWithGitHubSSOUseCase(
      userRepositoryMock,
      tokenGeneratorMock,
    );
  });

  it("should be able to login a user", async () => {
    const result = await useCase.execute({
      providerId: "123456",
      email: "john.doe@github.com",
      login: "john.doe",
      name: "John Doe",
      avatar: "https://example.com/avatar.jpg",
    });

    expect(result).toBe("token-access");
  });
});
