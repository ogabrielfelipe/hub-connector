import { RoutingExecution } from "@/core/domain/routing/entities/RoutingEcxecution";
import { IRoutingExecutionRepository } from "@/core/domain/routing/repositories/IRoutingExecutionRepository";
import {
  RoutingExecutionDocument,
  RoutingExecutionModel,
} from "../models/routingExecutionModel";
import { RoutingExecutionConverter } from "../converters/RoutingExecutionConverter";
import { domainEventBus } from "@/infra/events/event-queue";
import { RedisCacheRepository } from "@/infra/cache/redis/RedisCacheRepository";
import { CacheRepository } from "@/core/application/ports/CacheRepository";

export class MongoRoutingExecutionRepository
  implements IRoutingExecutionRepository
{
  private routingExecutionConverter: RoutingExecutionConverter;
  private cacheRepository: CacheRepository;

  constructor() {
    this.routingExecutionConverter = new RoutingExecutionConverter();
    this.cacheRepository = new RedisCacheRepository();
  }

  async save(routingExecution: RoutingExecution): Promise<RoutingExecution> {
    const persistence =
      this.routingExecutionConverter.toPersistence(routingExecution);

    const routingExecutionModel = await RoutingExecutionModel.findOneAndUpdate(
      { _id: persistence._id },
      persistence,
      {
        new: true,
        upsert: true,
      },
    ).lean();

    if (!routingExecutionModel) {
      throw new Error("Failed to save routing execution");
    }

    const events = routingExecution.pullDomainEvents();
    await domainEventBus.publish(events);

    await this.cacheRepository.set(
      `routing-executions:detail:${routingExecutionModel._id!.toString()}`,
      routingExecutionModel,
    );
    await this.cacheRepository.set(
      `routing-executions:byRoutingId:${routingExecutionModel.routingId}`,
      routingExecutionModel,
    );
    return this.routingExecutionConverter.toDomain(routingExecutionModel);
  }

  async findById(id: string): Promise<RoutingExecution | null> {
    const cached = await this.cacheRepository.get<RoutingExecutionDocument>(
      `routing-executions:detail:${id}`,
    );
    if (cached) {
      return this.routingExecutionConverter.toDomain(cached);
    }
    const routingExecutionModel =
      await RoutingExecutionModel.findById(id).lean();
    if (!routingExecutionModel) {
      return null;
    }
    await this.cacheRepository.set(
      `routing-executions:detail:${routingExecutionModel._id!.toString()}`,
      routingExecutionModel,
    );
    return this.routingExecutionConverter.toDomain(routingExecutionModel);
  }

  async findByRoutingId(routingId: string): Promise<RoutingExecution[]> {
    const cached = await this.cacheRepository.get<RoutingExecutionDocument[]>(
      `routing-executions:byRoutingId:${routingId}`,
    );
    if (cached) {
      return cached.map((model) =>
        this.routingExecutionConverter.toDomain(model),
      );
    }
    const routingExecutionModels = await RoutingExecutionModel.find({
      routingId,
    }).lean();
    await this.cacheRepository.set(
      `routing-executions:byRoutingId:${routingId}`,
      routingExecutionModels,
    );
    return routingExecutionModels.map((model) =>
      this.routingExecutionConverter.toDomain(model),
    );
  }

  async update(routingExecution: RoutingExecution): Promise<RoutingExecution> {
    const routingExecutionModel = await RoutingExecutionModel.findOneAndUpdate(
      { _id: routingExecution.getId() },
      {
        $set: {
          status: routingExecution.getStatus(),
          logStatus: routingExecution.getLogStatus(),
          payload: routingExecution.getPayload(),
          logExecution: routingExecution.getLogExecution(),
          errorMessage: routingExecution.getErrorMessage(),
          finishedAt: routingExecution.getFinishedAt(),
          updatedAt: routingExecution.getUpdatedAt(),
        },
      },
      {
        new: true,
      },
    ).lean();

    if (!routingExecutionModel) {
      throw new Error("Routing execution not found");
    }
    await this.cacheRepository.set(
      `routing-executions:detail:${routingExecutionModel._id!.toString()}`,
      routingExecutionModel,
    );
    await this.cacheRepository.set(
      `routing-executions:byRoutingId:${routingExecutionModel.routingId}`,
      routingExecutionModel,
    );
    return this.routingExecutionConverter.toDomain(routingExecutionModel);
  }

  async findAllByRoutingId({
    routingId,
    page = 1,
    limit = 10,
  }: {
    routingId: string;
    page?: number;
    limit?: number;
  }): Promise<{
    docs: RoutingExecution[];
    total: number;
    page: number;
    limit: number;
  }> {
    const offset = (page - 1) * limit;

    const cached = await this.cacheRepository.get<RoutingExecutionDocument[]>(
      `routing-executions:byRoutingId:${routingId}`,
    );
    if (cached) {
      return {
        docs: cached.map((model) =>
          this.routingExecutionConverter.toDomain(model),
        ),
        total: cached.length,
        page,
        limit,
      };
    }

    const routingExecutionModels = await RoutingExecutionModel.find({
      routingId,
    })
      .skip(offset)
      .limit(limit)
      .lean();

    const docs = routingExecutionModels.map((model) =>
      this.routingExecutionConverter.toDomain(model),
    );
    await this.cacheRepository.set(
      `routing-executions:byRoutingId:${routingId}`,
      docs,
    );
    return {
      docs,
      total: routingExecutionModels.length,
      page,
      limit,
    };
  }
}
