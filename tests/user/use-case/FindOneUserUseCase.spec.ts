import { FindOneUserUseCase } from "@/core/application/user/use-case/FindOneUserUseCase";
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



describe("FindOneUserUseCase", () => {
    const repo = new InMemoryUserRepository();
    let useCase: FindOneUserUseCase;

    beforeEach(() => {
        vi.clearAllMocks();

        useCase = new FindOneUserUseCase(repo);
    });

    it("should be able to find a user by id", async () => {
        const fakeUser = User.createNew(
            "John Doe",
            "john.doe",
            new Email("john.doe@hub.com"),
            UserRole.USER,
            "123456"
        );

        repo.save(fakeUser);

        const result = await useCase.execute(fakeUser.getId());

        expect(result).toBe(fakeUser);
    });

    it("should not be able to find a user by id that does not exist", async () => {
        await expect(() => useCase.execute("1")).rejects.toThrow("User not found");
    });
})