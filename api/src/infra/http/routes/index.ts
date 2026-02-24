import { IGatewayRepository } from "@/core/domain/gateway/repositories/IGatewayRepository";
import { IRoutingRepository } from "@/core/domain/routing/repositories/IRoutingRepository";
import { MongoGatewayRepository } from "@/infra/database/repositories/MongoGatewayRepository";
import { MongoRoutingRepository } from "@/infra/database/repositories/MongoRoutingRepository";
import { FastifyInstance } from "fastify";
import { usersRoutes } from "./UserRoutes";
import { authRoutes } from "./AuthRoutes";
import { gatewayRoutes } from "./GatewayRoutes";
import { routingRoutes } from "./RoutingRoutes";
import { configRoutes } from "./ConfigRoutes";
import { reportRoutes } from "./ReportRoutes";

export function registerRoutes(
    app: FastifyInstance,
    gatewayRepository?: IGatewayRepository,
    routingRepository?: IRoutingRepository
) {
    const gatewayRepo = gatewayRepository ?? new MongoGatewayRepository();
    const routingRepo =
        routingRepository ?? new MongoRoutingRepository(gatewayRepo);

    app.decorate("gatewayRepository", gatewayRepo);
    app.decorate("routingRepository", routingRepo);

    app.register(usersRoutes, { prefix: "/users" });
    app.register(authRoutes, { prefix: "/auth" });
    app.register(gatewayRoutes, { prefix: "/gateways" });
    app.register(routingRoutes, { prefix: "/routings" });
    app.register(configRoutes, { prefix: "/config" });
    app.register(reportRoutes, { prefix: "/report" });

    app.get("/docs/swagger", async (_, reply) => {
        return reply.type("text/html").send(`
    <!DOCTYPE html lang="pt-BR">
    <html>
      <head>
        <title>Documentação API</title>
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
        <script>
          SwaggerUIBundle({
            url: '/docs/swagger-public.json',
            dom_id: '#swagger-ui'
          })
        </script>
      </body>
    </html>
  `);
    });

}