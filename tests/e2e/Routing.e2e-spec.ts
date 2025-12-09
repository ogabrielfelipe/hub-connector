import { buildServer } from "@/server";
import { FastifyInstance } from "fastify";
import { loginAsAdmin } from "./utils/auth";
import { v4 as uuidV4 } from "uuid";

let app: FastifyInstance;

describe("Routing E2E", () => {
  beforeAll(async () => {
    app = await buildServer();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a routing", async () => {
    const token = await loginAsAdmin(app);

    const gateway = await app.db.gateway.create({
      _id: uuidV4(),
      name: "Test",
      xApiKey: "123456",
    });

    const response = await app.inject({
      method: "POST",
      url: "/routings",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      payload: {
        name: "Test",
        slug: "test",
        description: "Test",
        gatewayId: gateway._id,
        url: "http://localhost:3333",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toEqual(
      expect.objectContaining({
        name: "Test",
        url: "http://localhost:3333",
      }),
    );
  });

  it("should be able to update a routing", async () => {
    const token = await loginAsAdmin(app);

    const gateway = await app.db.gateway.create({
      _id: uuidV4(),
      name: "Test",
      xApiKey: "123456",
    });

    const routing = await app.db.routing.create({
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
      method: "PUT",
      url: `/routings/${routing._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      payload: {
        name: "Test Updated",
        slug: "test-updated",
        description: "Test Updated",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(
      expect.objectContaining({
        name: "Test Updated",
        slug: "test-updated",
        description: "Test Updated",
        url: "http://localhost:3333",
      }),
    );
  });

  it("should be able to delete a routing", async () => {
    const token = await loginAsAdmin(app);

    const gateway = await app.db.gateway.create({
      _id: uuidV4(),
      name: "Test",
      xApiKey: "123456",
    });

    const routing = await app.db.routing.create({
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
      method: "DELETE",
      url: `/routings/${routing._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(204);

    const routingDeleted = await app.db.routing.findById(routing._id);

    expect(routingDeleted).toBeNull();
  });

  it("should be able to find a routing by id", async () => {
    const token = await loginAsAdmin(app);

    const gateway = await app.db.gateway.create({
      _id: uuidV4(),
      name: "Test",
      xApiKey: "123456",
    });

    const routing = await app.db.routing.create({
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
      method: "GET",
      url: `/routings/${routing._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(
      expect.objectContaining({
        name: "Test",
        description: "Test",
        url: "http://localhost:3333",
      }),
    );
    expect(response.json().gateway).toEqual(
      expect.objectContaining({
        id: gateway._id,
      }),
    );
  });

  it("should be able to list all routings", async () => {
    const token = await loginAsAdmin(app);

    const gateway = await app.db.gateway.create({
      _id: uuidV4(),
      name: "Test",
      xApiKey: "123456",
    });

    const routing = await app.db.routing.create({
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

    const routing2 = await app.db.routing.create({
      _id: uuidV4(),
      name: "Test 2",
      slug: "test-2",
      description: "Test 2",
      gatewayId: gateway._id,
      url: "http://localhost:3333",
      method: "GET",
      headers: JSON.stringify({
        "Content-Type": "application/json",
      }),
    });

    const response = await app.inject({
      method: "GET",
      url: "/routings",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().docs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: routing._id,
          name: "Test",
          description: "Test",
        }),
        expect.objectContaining({
          id: routing2._id,
          name: "Test 2",
          description: "Test 2",
        }),
      ]),
    );

    const response2 = await app.inject({
      method: "GET",
      url: "/routings?page=1&limit=1",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response2.statusCode).toBe(200);
    expect(response2.json().docs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: routing._id,
          name: "Test",
          description: "Test",
        }),
      ]),
    );

    expect(response2.json().page).toBe(1);
    expect(response2.json().limit).toBe(1);
    expect(response2.json().total).toBe(2);
  });
});
