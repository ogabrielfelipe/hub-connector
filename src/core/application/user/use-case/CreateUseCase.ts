import { User, UserRole } from "../../../domain/user/entities/User";
import UsernameUsedError from "../../../domain/user/errors/UsernameUsedError";
import type { IUserRepository } from "../../../domain/user/repositories/IUserRepository";
import { Email } from "../../../domain/user/value-objects/Email";
import { IEventBus } from "@/core/application/IEventBus";
import { UserCreatedEvent } from "../../../domain/user/events/UserCreatedEvent";


interface CreateUserCaseCommand {
    name: string;
    username: string;
    email: string;
    role: string;
    password: string;
}


export class CreateUserUseCase {
    private userRepository: IUserRepository;
    private eventBus: IEventBus;

    constructor(userRepository: IUserRepository, eventBus: IEventBus) {
        this.userRepository = userRepository;
        this.eventBus = eventBus;
    }

    public async execute(command: CreateUserCaseCommand): Promise<string> {
        const emailVO = new Email(command.email);
        const role = command.role ? UserRole[command.role.toUpperCase() as keyof typeof UserRole] : UserRole.USER;

        const existingUserByUsername = await this.userRepository.findByUsername(command.username);
        if (existingUserByUsername) {
            throw new UsernameUsedError(command.username);
        }

        const newUser = User.createNew(
            command.name,
            command.username,
            emailVO,
            role,
            command.password
        );
        
        await this.userRepository.save(newUser);

        console.log(newUser);

        // Enviar evento para fila
        await this.eventBus.publish(
            new UserCreatedEvent(
                newUser.getId(),
                newUser.getEmail()
            )
        );

        return newUser.getId();
    }
}