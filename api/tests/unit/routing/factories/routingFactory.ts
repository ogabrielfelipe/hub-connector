import { Routing } from "@/core/domain/routing/entities/Routing";
import { faker } from "@faker-js/faker";

interface RoutingFactoryParams {
  name?: string;
  slug?: string;
  description?: string;
  gatewayId?: string;
  url?: string;
  params?: Record<string, string>;
  method?: string;
  headers?: Record<string, string>;
}

export const routingFactory = (params: RoutingFactoryParams) => {
  return Routing.createNew(
    params.name ?? faker.lorem.word({ length: 10 }),
    params.slug ?? faker.lorem.word({ length: 10 }).replace(" ", "-"),
    params.description ?? faker.lorem.sentence({ max: 50, min: 20 }),
    params.gatewayId ?? faker.database.collation(),
    params.url ?? faker.internet.url(),
    params.params ?? {},
    params.method ?? "GET",
    params.headers ?? {},
  );
};
