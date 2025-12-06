import { Gateway } from "@/core/domain/gateway/entities/Gateway";
import { GatewayDocument } from "../models/gateway.model";

export class GatewayConverter {
  public toDomain(dto: GatewayDocument): Gateway {
    return Gateway.fromPersistence(
      dto._id.toString(),
      dto.name,
      dto.xApiKey,
      dto.active,
      dto.createdAt,
      dto.updatedAt,
    );
  }
  public toPersistence(gateway: Gateway): Partial<GatewayDocument> {
    return {
      _id: gateway.getId(),
      name: gateway.getName(),
      xApiKey: gateway.getXApiKey(),
      active: gateway.getActive(),
      createdAt: gateway.getCreatedAt(),
      updatedAt: gateway.getUpdatedAt(),
    };
  }
}
