import { UpdateUserUseCase } from "@/core/application/user/use-case/UpdateUseCase";
import { User, UserRole } from "@/core/domain/user/entities/User";
import { Email } from "@/core/domain/user/value-objects/Email";
import { InMemoryUserRepository } from "../repositories/InMemoryUserRepository";
import { CaslAbilityFactory } from "@/core/application/security/casl.factory";


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
    const factory = new CaslAbilityFactory();

    beforeEach(() => {
        vi.clearAllMocks();

        useCase = new UpdateUserUseCase(repo, loggerMock, hasherMock, factory);
        repo.clear();
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


        await useCase.execute(userId, { name: "John Doe Updated" }, userId);

        const userFound = await repo.findById(userId);

        expect(userFound).toEqual(expect.objectContaining({
            name: "John Doe Updated",
        }));
    });

    it("should not be able to update a user if user does not have permission", async () => {
        const fakeUser = User.createNew(
            "John Doe",
            "john.doe",
            new Email("john.doe@hub.com"),
            UserRole.USER,
            "123456"
        );

        const fakeUser2 = User.createNew(
            "James Doe",
            "james.doe",
            new Email("james.doe@hub.com"),
            UserRole.USER,
            "123456"
        );

        const userId = fakeUser.getId();
        repo.save(fakeUser);
        repo.save(fakeUser2);


        await expect(
            useCase.execute(
                userId,
                { name: "John Doe Updated" },
                fakeUser2.getId()
            )
        ).rejects.toThrow("User does not have permission to perform this action");
    });



    it("should not be able to update a user that does not exist", async () => {
        await expect(() => useCase.execute("1", { name: "John Doe Updated" }, "1")).rejects.toThrow("User not found");
    });
});