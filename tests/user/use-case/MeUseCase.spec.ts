import { LoginUserUseCase } from "@/core/application/user/use-case/LoginUseCase";
import { MeUseCase } from "@/core/application/user/use-case/MeUseCase";
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

describe("MeUseCase", () => {
    
    let useCase: MeUseCase;
    
    beforeEach(() => {
        vi.clearAllMocks();

        useCase = new MeUseCase(userRepositoryMock);
    });

    it("should be able to get a user", async () => {
        const fakeUser = User.createNew(
            "John Doe",
            "john.doe",
            new Email("john.doe@hub.com") ,
            UserRole.USER,
            await hasherMock.hash("123456")
        );  

        userRepositoryMock.findById.mockResolvedValue(fakeUser);

        const result = await useCase.execute("1");

        expect(result).toBe(fakeUser);
    });

    it("should not be able to get a user that does not exist", async () => {
        userRepositoryMock.findById.mockResolvedValue(null);

        await expect(() => useCase.execute("1")).rejects.toThrow("User not found");
    });

})