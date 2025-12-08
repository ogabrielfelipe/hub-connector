import { Routing } from "@/core/domain/routing/entities/Routing";
import { RoutingDocument } from "../models/routing.model";

export class RoutingConverter {
  public toDomain(routing: RoutingDocument): Routing {
    return Routing.fromPersistence(
      routing._id.toString(),
      routing.name,
      routing.slug,
      routing.description,
      routing.gatewayId,
      routing.url,
      routing.method,
      JSON.parse(routing.headers),
      routing.createdAt,
      routing.updatedAt,
      routing.deletedAt,
    );
  }

  public toPersistence(routing: Routing): Partial<RoutingDocument> {
    return {
      _id: routing.getId(),
      name: routing.getName(),
      slug: routing.getSlug(),
      description: routing.getDescription(),
      gatewayId: routing.getGatewayId(),
      url: routing.getUrl(),
      method: routing.getMethod(),
      headers: JSON.stringify(routing.getHeaders()),
      createdAt: routing.getCreatedAt(),
      updatedAt: routing.getUpdatedAt(),
      deletedAt: routing.getDeletedAt(),
    };
  }
}
