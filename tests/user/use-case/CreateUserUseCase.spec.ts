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
            hasherMock
        );
    });

    it("should be able to create a user", async () => {


        const command = {
            name: "John Doe",
            username: "john.doe",
            role: "user",
            email: "john.doe@hub.com",
            password: "123456",
        };

        const resultId = await useCase.execute(command);


        expect(resultId).toBeTypeOf("string");



    });

    it("should not be able to create a user with a username that already exists", async () => {
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

        await expect(() => useCase.execute(command)).rejects.toThrow("This username is already in use: john.doe");
    });

});