import { buildServer } from "@/server";
import { FastifyInstance } from "fastify";
import { v4 as uuidV4 } from "uuid";

let app: FastifyInstance;

describe("Routing Execution E2E", () => {
  beforeAll(async () => {
    app = await buildServer();
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
      method: "GET",
      headers: JSON.stringify({
        "Content-Type": "application/json",
      }),
    });

    const response = await app.inject({
      method: "POST",
      url: `/routings/${route.slug}/execute`,
      payload: {
        payload: {},
      },
    });
    expect(response.statusCode).toBe(201);
  });
});
