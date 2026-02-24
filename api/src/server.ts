
import fastify from "fastify";


import { bootstrapDatabase } from "./infra/bootstrap/database";
import { registerPlugins } from "./infra/http/server/plugins";
import { registerRoutes } from "./infra/http/routes";
import { configureSwagger, generateSwaggerFiles } from "./infra/bootstrap/swagger";
import { IGatewayRepository } from "./core/domain/gateway/repositories/IGatewayRepository";
import { IRoutingRepository } from "./core/domain/routing/repositories/IRoutingRepository";

export async function buildServer({
  gatewayRepository,
  routingRepository,
}: {
  gatewayRepository?: IGatewayRepository;
  routingRepository?: IRoutingRepository;
}) {
  await bootstrapDatabase();

  const app = fastify({ logger: false });

  registerPlugins(app);
  configureSwagger(app);
  registerRoutes(app, gatewayRepository, routingRepository);

  await app.ready();

  generateSwaggerFiles(app);

  return app;
}


export async function startHttpServer() {
  const app = await buildServer({});
  await app.listen({ port: Number(process.env.PORT) || 3333, host: "0.0.0.0" });

  console.log(`Server running at http://0.0.0.0:${process.env.PORT || 3333}`);
}