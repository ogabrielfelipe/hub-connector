import { RoutingExecution } from "@/core/domain/routing/entities/RoutingEcxecution";
import { IRoutingExecutionRepository } from "@/core/domain/routing/repositories/IRoutingExecutionRepository";
import { RoutingExecutionModel } from "../models/routingExecutionModel";
import { RoutingExecutionConverter } from "../converters/RoutingExecutionConverter";
import { domainEventBus } from "@/infra/events/event-queue";

export class MongoRoutingExecutionRepository
  implements IRoutingExecutionRepository
{
  private routingExecutionConverter: RoutingExecutionConverter;

  constructor() {
    this.routingExecutionConverter = new RoutingExecutionConverter();
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

    return this.routingExecutionConverter.toDomain(routingExecutionModel);
  }

  async findById(id: string): Promise<RoutingExecution | null> {
    const routingExecutionModel =
      await RoutingExecutionModel.findById(id).lean();
    if (!routingExecutionModel) {
      return null;
    }
    return this.routingExecutionConverter.toDomain(routingExecutionModel);
  }

  async findByRoutingId(routingId: string): Promise<RoutingExecution[]> {
    const routingExecutionModels = await RoutingExecutionModel.find({
      routingId,
    }).lean();
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
    const routingExecutionModels = await RoutingExecutionModel.find({
      routingId,
    })
      .skip(offset)
      .limit(limit)
      .lean();

    const docs = routingExecutionModels.map((model) =>
      this.routingExecutionConverter.toDomain(model),
    );

    return {
      docs,
      total: routingExecutionModels.length,
      page,
      limit,
    };
  }
}
