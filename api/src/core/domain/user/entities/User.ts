import { Email } from "../value-objects/Email";
import { v4 as uuidv4 } from "uuid";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  DEV = "dev",
}

export class User {
  private id: string;
  private name: string;
  private providerId?: string;
  private avatar?: string;
  private username: string;
  private email: Email;
  private role: UserRole;
  private active: boolean;
  private password: string;

  private constructor(
    id: string,
    name: string,
    username: string,
    email: Email,
    role: UserRole,
    active: boolean,
    password: string,
    providerId?: string,
    avatar?: string,
  ) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.email = email;
    this.role = role;
    this.active = active;
    this.password = password;
    this.providerId = providerId;
    this.avatar = avatar;
  }

  public static createNew(
    name: string,
    username: string,
    email: Email,
    role: UserRole,
    password: string,
    providerId?: string,
    avatar?: string,
  ): User {
    const newId = uuidv4();
    return new User(newId, name, username, email, role, true, password, providerId, avatar);
  }

  public static fromPersistence(
    id: string,
    name: string,
    username: string,
    email: string,
    role: string,
    active: boolean,
    password: string,
    providerId?: string,
    avatar?: string,
  ): User {
    return new User(
      id,
      name,
      username,
      new Email(email),
      role as UserRole,
      active,
      password,
      providerId,
      avatar,
    );
  }

  public getId(): string {
    return this.id;
  }
  public getName(): string {
    return this.name;
  }
  public getUsername(): string {
    return this.username;
  }
  public getEmail(): string {
    return this.email.getValue();
  }
  public getRole(): string {
    return this.role;
  }
  public getActive(): boolean {
    return this.active;
  }
  public getPassword(): string {
    return this.password;
  }
  public getProviderId(): string | undefined {
    return this.providerId;
  }
  public getAvatar(): string | undefined {
    return this.avatar;
  }

  public updateName(newName: string): void {
    if (!newName || newName.trim() === "") {
      throw new Error("Name cannot be empty.");
    } else if (newName.length < 3) {
      throw new Error("Name must be at least 3 characters long.");
    }
    this.name = newName;
  }
  public updateEmail(newEmail: string): void {
    this.email = new Email(newEmail);
  }
  public updateRole(newRole: UserRole): void {
    this.role = newRole;
  }
  public updateActive(newActive: boolean): void {
    this.active = newActive;
  }
  public updatePassword(newPassword: string): void {
    this.password = newPassword;
  }
  public updateProviderId(newProviderId: string): void {
    this.providerId = newProviderId;
  }
  public updateAvatar(newAvatar: string): void {
    this.avatar = newAvatar;
  }
}
