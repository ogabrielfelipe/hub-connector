import { MongoAbility } from "@casl/ability";

export type Actions = "manage" | "create" | "read" | "update" | "delete";

export type Subjects = "User" | "all";

export type AppAbility = MongoAbility<[Actions, Subjects]>;
