import { CreateUserUseCase } from "@/core/application/user/use-case/CreateUseCase";
import { InMemoryUserRepository } from "../../repositories/InMemoryUserRepository";
import { constants } from "node:fs/promises";
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

const eventBusMock = {
    publish: vi.fn()
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

const abilityMock = {
    can: vi.fn(() => true),
    cannot: vi.fn(() => false)
};

const caslFactoryMock = {
    createForUser: vi.fn().mockReturnValue(abilityMock),
};

describe("CreateUserUseCase", async () => {
    let useCase: CreateUserUseCase;
    const repo = new InMemoryUserRepository();

    beforeEach(() => {
        vi.clearAllMocks();
        repo.clear();

        useCase = new CreateUserUseCase(
            repo,
            eventBusMock,
            loggerMock,
            hasherMock,
            caslFactoryMock
        );
    });

    it("should be able to create a user", async () => {

        repo.save(User.createNew(
            "John Doe",
            "john.doe",
            new Email("john.doe@hub.com"),
            UserRole.ADMIN,
            "123456"
        ));

        const adminUser = await repo.findByUsername("john.doe");

        const command = {
            name: "James Doe",
            username: "james.doe",
            role: "user",
            email: "james.doe@hub.com",
            password: "123456",
        };

        const resultId = await useCase.execute(adminUser!.getId(), command);


        expect(resultId).toBeTypeOf("string");



    });

    it("should not be able to create a user if user does not have permission", async () => {

        const fakeUser = User.createNew(
            "John Doe",
            "john.doe",
            new Email("john.doe@hub.com"),
            UserRole.USER,
            "123456"
        );

        repo.save(fakeUser);
        const user = await repo.findByUsername("john.doe");

        const command = {
            name: "James Doe",
            username: "james.doe",
            role: "user",
            email: "james.doe@hub.com",
            password: "123456",
        };
        abilityMock.can.mockReturnValue(false);

        await expect(() => useCase.execute(user!.getId(), command)).rejects.toThrow("User does not have permission to create a new user");
    });

    it("should not be able to create a user with a username that already exists", async () => {
        abilityMock.can.mockReturnValue(true);

        const fakeUserAdmin = User.createNew(
            "John Doe",
            "john.doe",
            new Email("john.doe@hub.com"),
            UserRole.ADMIN,
            "123456"
        );

        repo.save(fakeUserAdmin);
        const adminUser = await repo.findByUsername("john.doe");

        const fakeUser = User.createNew(
            "John Doe",
            "john.doe",
            new Email("john.doe@hub.com"),
            UserRole.USER,
            "123456"
        );

        repo.save(fakeUser);

        const command = {
            name: "John Doe",
            username: "john.doe",
            role: "user",
            email: "john.doe@hub.com",
            password: "123456",
        };

        await expect(() => useCase.execute(adminUser!.getId(), command)).rejects.toThrow("This username is already in use: john.doe");
    });

});