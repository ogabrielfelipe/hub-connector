import { User, UserRole } from "@/core/domain/user/entities/User";
import { Email } from "@/core/domain/user/value-objects/Email";
import { faker } from "@faker-js/faker";

interface UserFactoryProps {
  name?: string;
  username?: string;
  email?: string;
  role?: "user" | "admin" | "dev";
  password?: string;
}

export function userFactory(user?: UserFactoryProps) {
  return User.createNew(
    user?.name ?? faker.person.firstName(),
    user?.username ?? faker.internet.username(),
    new Email(user?.email ?? faker.internet.email()),
    user?.role
      ? user?.role === "admin"
        ? UserRole.ADMIN
        : user?.role === "dev"
          ? UserRole.DEV
          : UserRole.USER
      : UserRole.USER,
    user?.password ?? faker.internet.password(),
  );
}
