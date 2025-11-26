import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import type { AppAbility } from "./casl.types";

export function defineAbilityFor(role: string): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  switch (role) {
    case "admin":
      can("manage", "all");
      break;

    case "dev":
      can("read", "User");
      can("update", "User");
      break;

    case "user":
      can("read", "User");
      break;

    default:
      cannot("manage", "all");
  }

  return build();
}
