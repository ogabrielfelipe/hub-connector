import { buildServer } from "@/server";
import { FastifyInstance } from "fastify";
import { loginAsAdmin } from "./utils/auth";
import { v4 as uuidV4 } from "uuid";

let app: FastifyInstance;

describe("User E2E", () => {
  beforeAll(async () => {
    app = await buildServer();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a gateway", async () => {
    const token = await loginAsAdmin(app);

    const response = await app.inject({
      method: "POST",
      url: "/gateways",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      payload: {
        name: "Integração BOB",
        routes: [],
      },
    });

    expect(response.statusCode).toBe(201);
  });

  it("should be able to update a gateway existing", async () => {
    const token = await loginAsAdmin(app);

    const gateway = await app.db.gateway.create({
      _id: uuidV4(),
      name: "Integração teste",
      xApiKey: "123456",
      routes: [],
    });

    const response = await app.inject({
      method: "PUT",
      url: `/gateways/${gateway._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      payload: {
        name: "Integração teste Updated",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(
      expect.objectContaining({
        name: "Integração teste Updated",
      }),
    );
  });

  it("should be able to delete a gateway existing", async () => {
    const token = await loginAsAdmin(app);

    const gateway = await app.db.gateway.create({
      _id: uuidV4(),
      name: "Integração teste",
      xApiKey: "123456",
      routes: [],
    });

    const response = await app.inject({
      method: "DELETE",
      url: `/gateways/${gateway._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(204);

    const gatewayDeleted = await app.db.gateway.findById(gateway._id);

    expect(gatewayDeleted).toBeNull();
  });

  it("should be able to find by id a gateway existing", async () => {
    const token = await loginAsAdmin(app);

    const gateway = await app.db.gateway.create({
      _id: uuidV4(),
      name: "Integração teste",
      xApiKey: "123456",
      routes: [],
    });

    const response = await app.inject({
      method: "GET",
      url: `/gateways/${gateway._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(
      expect.objectContaining({
        name: "Integração teste",
      }),
    );
  });

  it("should be able to list all gateways", async () => {
    const token = await loginAsAdmin(app);

    await app.db.gateway.create({
      _id: uuidV4(),
      name: "Integração teste",
      xApiKey: "123456",
      routes: [],
    });

    await app.db.gateway.create({
      _id: uuidV4(),
      name: "Integração teste 2",
      xApiKey: "123456",
      routes: [],
    });

    const response = await app.inject({
      method: "GET",
      url: `/gateways`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().docs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Integração teste",
        }),
        expect.objectContaining({
          name: "Integração teste 2",
        }),
      ]),
    );
  });

  it("should be able to list all gateways with pagination", async () => {
    const token = await loginAsAdmin(app);

    await app.db.gateway.create({
      _id: uuidV4(),
      name: "Integração teste",
      xApiKey: "123456",
      routes: [],
    });

    await app.db.gateway.create({
      _id: uuidV4(),
      name: "Integração teste 2",
      xApiKey: "123456",
      routes: [],
    });

    const response = await app.inject({
      method: "GET",
      url: `/gateways?page=1&limit=1`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().docs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Integração teste",
        }),
      ]),
    );
    expect(response.json().page).toBe(1);
    expect(response.json().limit).toBe(1);
    expect(response.json().total).toBe(2);
  });
});
