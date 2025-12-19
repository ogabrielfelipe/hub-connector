/* eslint-disable @typescript-eslint/no-explicit-any */
import { IGatewayRepository } from "@/core/domain/gateway/repositories/IGatewayRepository";
import { IRoutingRepository } from "@/core/domain/routing/repositories/IRoutingRepository";
import "fastify";
import { Model } from "mongoose";

declare module "fastify" {
  interface FastifyInstance {
    db: {
      user: Model<any>;
      gateway: Model<any>;
      routing: Model<any>;
    };
    gatewayRepository: IGatewayRepository;
    routingRepository: IRoutingRepository;
  }
}
