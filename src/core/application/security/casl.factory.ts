import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import { Actions, AppAbility } from "./casl.types";
import { User, UserRole } from "@/core/domain/user/entities/User";

export class CaslAbilityFactory {
  createForUser(currentUser: User): AppAbility {
    const builder = new AbilityBuilder<AppAbility>(createMongoAbility);
    const { can, cannot, build } = builder;

    switch (currentUser.getRole()) {
      case UserRole.ADMIN:
        can(Actions.Manage, "all");
        break;

      case UserRole.DEV:
        // User
        can(Actions.Read, "User", { id: { $eq: currentUser.getId() } });
        can(Actions.Update, "User", { id: { $eq: currentUser.getId() } });
        cannot(Actions.Update, "User", { id: { $neq: currentUser.getId() } });
        cannot(Actions.Delete, "User");

        // Gateway
        can(Actions.Create, "Gateway");
        can(Actions.Read, "Gateway");
        can(Actions.Update, "Gateway");
        cannot(Actions.Delete, "Gateway");
        break;
      case UserRole.USER:
        // User
        can(Actions.Read, "User", { id: { $eq: currentUser.getId() } });
        can(Actions.Update, "User", { id: { $eq: currentUser.getId() } });
        cannot(Actions.Update, "User", { id: { $neq: currentUser.getId() } });
        cannot(Actions.Delete, "User");

        // Gateway
        can(Actions.Read, "Gateway");
        cannot(Actions.Create, "Gateway");
        cannot(Actions.Update, "Gateway");
        cannot(Actions.Delete, "Gateway");
        break;

      default:
        cannot(Actions.Manage, "all");
    }

    return build({
      detectSubjectType: () => "User",
    });
  }
}
