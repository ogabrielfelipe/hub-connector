import { GatewayDocument } from "@/infra/database/models/gatewayModel";
import { RoutingDocument } from "@/infra/database/models/routingModel";
import { WinstonLoggerService } from "@/infra/logger/winston-logger.service";
import { FastifyReply, FastifyRequest } from "fastify";

export async function apiKeyMiddleware(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const logger = new WinstonLoggerService();

  try {
    const xApiKey = req.headers["x-api-key"];
    if (!xApiKey) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    const gateway = await req.server.db.gateway
      .findOne<GatewayDocument>({ xApiKey })
      .lean();

    if (!gateway) {
      return reply.status(401).send({ error: "G Unauthorized" });
    }

    const routes = await req.server.db.routing
      .find<RoutingDocument[]>({ gatewayId: gateway._id })
      .lean();


    if (!routes) {
      return reply.status(401).send({ error: "R Unauthorized" });
    }

    const routingSlug = (req.params as { routingSlug: string }).routingSlug;


    const route = routes.find(
      (route: RoutingDocument) => route.slug == routingSlug,
    );


    if (!route) {
      return reply.status(401).send({ error: "Unauthorized" });
    }
  } catch (err: unknown) {
    logger.error((err as Error).message);
    reply.status(401).send({ error: "Invalid API Key" });
  }
}
