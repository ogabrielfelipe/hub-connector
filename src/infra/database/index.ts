import { UserModel } from "./models/user.model";
import { GatewayModel } from "./models/gateway.model";

export const mongoDb = {
  user: UserModel,
  gateway: GatewayModel,
};
