/* eslint-disable @typescript-eslint/no-explicit-any */
import { IGatewayRepository } from "@/core/domain/gateway/repositories/IGatewayRepository";
import { Routing } from "@/core/domain/routing/entities/Routing";
import {
  IRoutingRepository,
  RoutingDetail,
  RoutingList,
  RoutingWithPagination,
} from "@/core/domain/routing/repositories/IRoutingRepository";
import { RoutingModel } from "../models/routingModel";
import { RoutingConverter } from "../converters/RoutingConverter";
import { GatewayConverter } from "../converters/GatewayConverter";

export class MongoRoutingRepository implements IRoutingRepository {
  private gatewayRepository: IGatewayRepository;
  private routingConverter: RoutingConverter;
  private gatewayConverter: GatewayConverter;

  constructor(gatewayRepository: IGatewayRepository) {
    this.gatewayRepository = gatewayRepository;
    this.routingConverter = new RoutingConverter();
    this.gatewayConverter = new GatewayConverter();
  }

  async save(routing: Routing): Promise<Routing> {
    const persistence = this.routingConverter.toPersistence(routing);

    const routingModel = await RoutingModel.findOneAndUpdate(
      { _id: persistence._id },
      persistence,
      {
        new: true,
        upsert: true,
      },
    ).lean();

    return this.routingConverter.toDomain(routingModel);
  }

  async update(routing: Routing): Promise<Routing> {
    const routingModel = await RoutingModel.findOneAndUpdate(
      { _id: routing.getId() },
      {
        $set: {
          name: routing.getName(),
          description: routing.getDescription(),
          gatewayId: routing.getGatewayId(),
          url: routing.getUrl(),
          method: routing.getMethod(),
          headers: JSON.stringify(routing.getHeaders()),
        },
      },
      {
        new: true, // retorna o atualizado
      },
    ).lean();

    if (!routingModel) {
      throw new Error("Routing not found");
    }

    return this.routingConverter.toDomain(routingModel);
  }

  async delete(routing: Routing): Promise<void> {
    const routingModel = await RoutingModel.findById(routing.getId());
    if (!routingModel) {
      throw new Error("Routing not found");
    }
    await routingModel.deleteOne();
  }

  async findById(id: string): Promise<Routing | null> {
    const routingModel = await RoutingModel.findById(id).lean();
    if (!routingModel) {
      return null;
    }
    return this.routingConverter.toDomain(routingModel);
  }

  async findOneBySlug(slug: string): Promise<Routing | null> {
    const routingModel = await RoutingModel.findOne({ slug }).lean();
    if (!routingModel) {
      return null;
    }
    return this.routingConverter.toDomain(routingModel);
  }

  async findAll({
    name,
    slug,
    gatewayId,
    page = 1,
    limit = 10,
  }: {
    name?: string;
    slug?: string;
    gatewayId?: string;
    page?: number;
    limit?: number;
  }): Promise<RoutingWithPagination> {
    const offset = (page - 1) * limit;
    const queryFilters: any = {};
    if (name) {
      queryFilters.name = { $regex: name, $options: "i" };
    }
    if (slug) {
      queryFilters.slug = { $regex: slug, $options: "i" };
    }
    if (gatewayId) {
      queryFilters.gatewayId = gatewayId;
    }
    const routingModels = await RoutingModel.find(queryFilters)
      .skip(offset)
      .limit(limit)
      .lean();
    const total = await RoutingModel.countDocuments(queryFilters);

    const resultFiltered: RoutingList[] = await Promise.all(
      routingModels.map(async (routingModel) => {
        const gateway = await this.gatewayRepository.findById(
          routingModel.gatewayId,
        );
        if (!gateway) {
          throw new Error("Gateway not found");
        }

        return {
          id: routingModel._id.toString(),
          name: routingModel.name,
          slug: routingModel.slug,
          description: routingModel.description,
          gateway: {
            id: gateway.getId(),
            name: gateway.getName(),
          },
          deletedAt: routingModel.deletedAt,
        };
      }),
    );

    return {
      docs: resultFiltered,
      total,
      page,
      limit,
    };
  }

  async findOneDetail(id: string): Promise<RoutingDetail | null> {
    const routingModel = await RoutingModel.findById(id).lean();
    if (!routingModel) {
      return null;
    }

    const gateway = await this.gatewayRepository.findById(
      routingModel.gatewayId,
    );
    if (!gateway) {
      return null;
    }

    const routing = this.routingConverter.toDomain(routingModel);
    return Object.assign(routing, { gateway });
  }
}
