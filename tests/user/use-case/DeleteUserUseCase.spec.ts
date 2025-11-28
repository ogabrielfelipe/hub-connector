import { DeleteUserUseCase } from "@/core/application/user/use-case/DeleteUserUseCase";
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


describe("DeleteUserUseCase", () => {
    const repo = new InMemoryUserRepository();
    let useCase: DeleteUserUseCase;

    beforeEach(() => {
        vi.clearAllMocks();

        useCase = new DeleteUserUseCase(repo);
    });

    it("should be able to delete a user", async () => {
        const fakeUser = User.createNew(
            "John Doe",
            "john.doe",
            new Email("john.doe@hub.com"),
            UserRole.USER,
            "123456"
        );

        repo.save(fakeUser);

        await useCase.execute(fakeUser.getId());
        expect(await repo.findById(fakeUser.getId())).toBeNull();
    });

    it("should not be able to delete a user that does not exist", async () => {
        await expect(() => useCase.execute("1")).rejects.toThrow("User not found");
    });
})