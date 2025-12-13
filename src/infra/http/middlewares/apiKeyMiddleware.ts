import { GatewayDocument } from "@/infra/database/models/gatewayModel";
import { RoutingDocument } from "@/infra/database/models/routingModel";
import { logger } from "@/infra/logger/logger.factory";
import { FastifyReply, FastifyRequest } from "fastify";

export async function apiKeyMiddleware(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const xApiKey = req.headers["x-api-key"];
    if (!xApiKey) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    const gateway = await req.server.db.gateway.findOne<GatewayDocument>({ xApiKey }).lean()  // await gatewayRepo.findByKey(String(xApiKey));


    console.log("gateway", gateway)
    if (!gateway) {
      return reply.status(401).send({ error: "G Unauthorized" });
    }

    const routes = await req.server.db.routing.find<RoutingDocument[]>({ gatewayId: gateway._id }).lean()  // await routingRepo.findAllByGatewayId(gateway.getId());

    console.log("routes", routes)

    if (!routes) {
      return reply.status(401).send({ error: "R Unauthorized" });
    }

    const routingSlug = (req.params as { routingSlug: string }).routingSlug;

    console.log(routingSlug)

    const route = routes.find(
      (route: RoutingDocument) => route.slug == routingSlug,
    );

    console.log("route", route)

    if (!route) {
      return reply.status(401).send({ error: "Unauthorized" });
    }
  } catch (err: unknown) {
    logger.error(err);
    reply.status(401).send({ error: "Invalid API Key" });
  }
}
