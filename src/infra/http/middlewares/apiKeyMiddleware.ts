import { MongoGatewayRepository } from "@/infra/database/repositories/MongoGatewayRepository";
import { MongoRoutingRepository } from "@/infra/database/repositories/MongoRoutingRepository";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function apiKeyMiddleware(req: FastifyRequest, reply: FastifyReply) {
    try {
        const xApiKey = req.headers["x-api-key"];
        if (!xApiKey) return reply.status(401).send({ error: "Unauthorized" });

        const gateway = await new MongoGatewayRepository().findByKey(xApiKey as string);
        if (!gateway) return reply.status(401).send({ error: "Unauthorized" });

        const routes = await new MongoRoutingRepository(new MongoGatewayRepository()).findAllByGatewayId(gateway.getId());
        if (!routes.length) return reply.status(401).send({ error: "Unauthorized" });

        const route = routes.find((route) => route.getSlug() === (req.params as { routingSlug: string })['routingSlug']);
        if (!route) return reply.status(401).send({ error: "Unauthorized" });

    } catch {
        reply.status(401).send({ error: "Invalid API Key" });
    }
}
