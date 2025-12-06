import { Routing } from "@/core/domain/routing/entities/Routing";
import { faker } from "@faker-js/faker";

interface RoutingFactoryParams {
  name?: string;
  description?: string;
  gatewayId?: string;
  url?: string;
  method?: string;
  headers?: Record<string, string>;
}

export const routingFactory = (params: RoutingFactoryParams) => {
  return Routing.createNew(
    params.name ?? faker.lorem.word({ length: 10 }),
    params.description ?? faker.lorem.sentence({ max: 50, min: 20 }),
    params.gatewayId ?? faker.database.collation(),
    params.url ?? faker.internet.url(),
    params.method ?? "GET",
    params.headers ?? {},
  );
};
