import { buildServer } from "@/server";
import { FastifyInstance } from "fastify";
import { InMemoryGatewayReposiory } from "../unit/gateway/repositories/InMemoryGatewayReposiory";
import { InMemoryRoutingRepository } from "../unit/routing/repositories/InMemoryRoutingRepository";
import { gatewayFactory } from "../unit/gateway/factories/gatewayFactory";
import { routingFactory } from "../unit/routing/factories/routingFactory";
let app: FastifyInstance;


describe("Routing Execution E2E", () => {
  let gatewayRepository: InMemoryGatewayReposiory;
  let routingRepository: InMemoryRoutingRepository;


  beforeAll(async () => {
    gatewayRepository = new InMemoryGatewayReposiory();
    routingRepository = new InMemoryRoutingRepository(gatewayRepository);


    app = await buildServer({ gatewayRepository, routingRepository });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should create a new routing execution", async () => {
    const gatewayFac = gatewayFactory();
    const gateway = await gatewayRepository.save(gatewayFac);

    const routeFac = routingFactory({ gatewayId: gateway.getId() });
    const route = await routingRepository.save(routeFac);

    await app.db.gateway.create({
      _id: gateway.getId(),
      name: gateway.getName(),
      xApiKey: gateway.getXApiKey(),
    });

    await app.db.routing.create({
      _id: route.getId(),
      name: route.getName(),
      slug: route.getSlug(),
      description: route.getDescription(),
      gatewayId: gatewayFac.getId(),
      url: route.getUrl(),
      params: JSON.stringify(route.getParams()),
      method: 'POST',
      headers: JSON.stringify({}),
    });


    const response = await app.inject({
      method: "POST",
      url: `/routings/${route.getSlug()}/execute`,
      headers: {
        "x-api-key": gateway.getXApiKey(),
      },
      payload: {
        payload: {},
      },
    });


    expect(response.statusCode).toBe(201);
  });
});
