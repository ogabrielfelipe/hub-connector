
import { buildServer } from "@/server";
import { FastifyInstance } from "fastify";
import { v4 as uuidV4 } from "uuid";
import { InMemoryGatewayReposiory } from "../unit/gateway/repositories/InMemoryGatewayReposiory";
import { InMemoryRoutingRepository } from "../unit/routing/repositories/InMemoryRoutingRepository";
let app: FastifyInstance;



describe("Routing Execution E2E", () => {
  beforeAll(async () => {
    const gatewayRepository = new InMemoryGatewayReposiory();
    const routingRepository = new InMemoryRoutingRepository(gatewayRepository);

    app = await buildServer({
      gatewayRepository,
      routingRepository,
    });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should create a new routing execution", async () => {
    const gateway = await app.db.gateway.create({
      _id: uuidV4(),
      name: "Test",
      xApiKey: "123456",
    });

    const route = await app.db.routing.create({
      _id: uuidV4(),
      name: "Test",
      slug: "test",
      description: "Test",
      gatewayId: gateway._id,
      url: "http://localhost:3333",
      params: JSON.stringify({}),
      method: "GET",
      headers: JSON.stringify({
        "Content-Type": "application/json",
      }),
    });

    const response = await app.inject({
      method: "POST",
      url: `/routings/${route.slug}/execute`,
      headers: {
        "x-api-key": gateway.xApiKey,
      },
      payload: {
        payload: {},
      },
    });
    expect(response.statusCode).toBe(201);
  });
});
