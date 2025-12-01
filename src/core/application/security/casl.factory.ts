import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import { Actions, AppAbility, Subjects } from "./casl.types";
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
      case UserRole.USER:
        can(Actions.Read, "User", { id: { $eq: currentUser.getId() } });
        can(Actions.Update, "User", { id: { $eq: currentUser.getId() } });
        cannot(Actions.Update, "User", { id: { $neq: currentUser.getId() } });
        cannot(Actions.Delete, "User");
        break;

      default:
        cannot(Actions.Manage, "all");
    }

    return build({
      detectSubjectType: () => "User"
    });
  }
}
