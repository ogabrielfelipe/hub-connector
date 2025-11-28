import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import { Actions, AppAbility } from "./casl.types";
import { User, UserRole } from "@/core/domain/user/entities/User";

export class CaslAbilityFactory {
  createForUser(currentUser: User): AppAbility {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    switch (currentUser.getRole()) {
      case UserRole.ADMIN:
        can(Actions.Manage, "all");
        break;

      case UserRole.DEV:
        can(Actions.Read, "User");
        can(Actions.Update, "User", { id: currentUser.getId() });
        break;

      case UserRole.USER:
        can(Actions.Read, "User");
        can(Actions.Update, "User", { id: currentUser.getId() });
        break;

      default:
        cannot(Actions.Manage, "all");
    }

    return build({
      // detecta o tipo de subject pela sua constructor function
      detectSubjectType: (subject) => (subject as any).constructor,
    });
  }
}
