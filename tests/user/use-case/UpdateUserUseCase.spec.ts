import { UpdateUserUseCase } from "@/core/application/user/use-case/UpdateUseCase";
import { User, UserRole } from "@/core/domain/user/entities/User";
import { Email } from "@/core/domain/user/value-objects/Email";
import { InMemoryUserRepository } from "../../repositories/InMemoryUserRepository";



const userRepositoryMock = {
    findByUsername: vi.fn(),
    save: vi.fn(),
    findById: vi.fn(),
    findByEmail: vi.fn(),
    findAll: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
}

const loggerMock = {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn()
}

const hasherMock = {
    hash: vi.fn(),
    compare: vi.fn()
}


describe("UpdateUserUseCase", () => {
    const repo = new InMemoryUserRepository();
    let useCase: UpdateUserUseCase;

    beforeEach(() => {
        vi.clearAllMocks();

        useCase = new UpdateUserUseCase(repo, loggerMock, hasherMock);
    });

    it("should be able to update a user", async () => {

        const fakeUser = User.createNew(
            "John Doe",
            "john.doe",
            new Email("john.doe@hub.com"),
            UserRole.USER,
            "123456"
        );

        const userId = fakeUser.getId();
        repo.save(fakeUser);


        await useCase.execute(userId, { name: "John Doe Updated" });

        const userFound = await repo.findById(userId);

        expect(userFound).toEqual(expect.objectContaining({
            name: "John Doe Updated",
        }));


    });

    it("should not be able to update a user that does not exist", async () => {
        await expect(() => useCase.execute("1", { name: "John Doe Updated" })).rejects.toThrow("User not found");
    });
});