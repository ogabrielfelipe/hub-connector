import { LoginUserUseCase } from "@/core/application/user/use-case/LoginUseCase";
import { User, UserRole } from "@/core/domain/user/entities/User";
import { Email } from "@/core/domain/user/value-objects/Email";


const userRepositoryMock = {
    findByUsername: vi.fn(),
    save: vi.fn(),
    findById: vi.fn(),
    findByEmail: vi.fn(),
    findAll: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
}

const tokenGeneratorMock = {
    verify: vi.fn(),
    generate: vi.fn(() => "token-access")
}

const hasherMock = {
    hash: vi.fn((value: string) => Promise.resolve(`hash-${value}`)),
    compare: vi.fn(async (value: string, hash: string) => {
        return hash === `hash-${value}`;
    })
}

describe("LoginUserUseCase", () => {
    
    let useCase: LoginUserUseCase;
    
    beforeEach(() => {
        vi.clearAllMocks();

        useCase = new LoginUserUseCase(userRepositoryMock, hasherMock, tokenGeneratorMock);
    });

    it("should be able to login a user", async () => {
        const fakeUser = User.createNew(
            "John Doe",
            "john.doe",
            new Email("john.doe@hub.com") ,
            UserRole.USER,
            await hasherMock.hash("123456")
        );  

        userRepositoryMock.findByUsername.mockResolvedValue(fakeUser);

        const result = await useCase.execute({username: "john.doe", password: "123456"});

        expect(hasherMock.compare).toHaveBeenCalledWith("123456", "hash-123456");
        expect(result).toBe("token-access");
    });

    it("should not be able to login a user with invalid credentials", async () => {
        const fakeUser = User.createNew(
            "John Doe",
            "john.doe",
            new Email("john.doe@hub.com") ,
            UserRole.USER,
            await hasherMock.hash("123456")
        );  

        userRepositoryMock.findByUsername.mockResolvedValue(fakeUser);

        await expect(() => useCase.execute({username: "john.doe", password: "123456Error"})).rejects.toThrow("Invalid credentials");
    });

})