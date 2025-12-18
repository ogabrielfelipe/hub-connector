import { Routing } from "@/core/domain/routing/entities/Routing";
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

    const gateway = await req.server.gatewayRepository.findByKey(
      xApiKey as string,
    );

    if (!gateway) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    const routes = await req.server.routingRepository.findAllByGatewayId(
      gateway.getId(),
    );

    console.log(routes);

    if (!routes) {
      return reply.status(401).send({ error: "Routing not found" });
    }

    const routingSlug = (req.params as { routingSlug: string }).routingSlug;

    console.log(routingSlug);

    const route = routes.find(
      (route: Routing) => route.getSlug() == routingSlug,
    );

    if (!route) {
      return reply.status(401).send({ error: "Routing not found" });
    }
  } catch (err: unknown) {
    logger.error((err as Error).message);
    reply.status(401).send({ error: "Invalid API Key" });
  }
}
