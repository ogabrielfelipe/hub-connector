import { UserModel } from "./models/user.model";
import { GatewayModel } from "./models/gateway.model";
import { RoutingModel } from "./models/routing.model";

export const mongoDb = {
  user: UserModel,
  gateway: GatewayModel,
  routing: RoutingModel,
};
