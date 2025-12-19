import { UserModel } from "./models/userModel";
import { GatewayModel } from "./models/gatewayModel";
import { RoutingModel } from "./models/routingModel";

export const mongoDb = {
  user: UserModel,
  gateway: GatewayModel,
  routing: RoutingModel,
};
