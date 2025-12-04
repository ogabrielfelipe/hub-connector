import { MongoAbility, InferSubjects } from "@casl/ability";
import { User } from "@/core/domain/user/entities/User";
import { Gateway } from "@/core/domain/gateway/entities/Gateway";

// ações como enum (sempre usar enum, não string literal)
export enum Actions {
    Manage = "manage",
    Create = "create",
    Read = "read",
    Update = "update",
    Delete = "delete",
}

// Subjects: usar InferSubjects passando *o mesmo* User exportado do domínio
export type Subjects = InferSubjects<User | "User" | Gateway | "Gateway"> | "all";

// AppAbility tipado corretamente: primeiro Actions, depois Subjects
export type AppAbility = MongoAbility<[Actions, Subjects]>;
