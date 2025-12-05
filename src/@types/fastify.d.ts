import "fastify";
import { Model } from "mongoose";

declare module "fastify" {
    interface FastifyInstance {
        db: {
            user: Model<any>;
            gateway: Model<any>;
        };
    }
}
