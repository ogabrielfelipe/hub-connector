/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import { MongoGatewayRepository } from "../database/repositories/MongoGatewayRepository";
import { MongoRoutingExecutionRepository } from "../database/repositories/MongoRoutingExecutionRepository";
import { MongoRoutingRepository } from "../database/repositories/MongoRoutingRepository";
import { RoutingExecutionSearchIndexer } from "../search/opensearch/RoutingExecutionSearchIndexer";
import { RoutingExecution } from "@/core/domain/routing/entities/RoutingEcxecution";

export class OnRoutingExecutionCreatedHandler {
  async handle(event: any) {
    const gatewayRepository = new MongoGatewayRepository();
    const routingRepository = new MongoRoutingRepository(gatewayRepository);
    const routingExecutionRepository = new MongoRoutingExecutionRepository();

    const route = await routingRepository.findById(event.routingId);

    if (!route) {
      throw new Error("Route not found");
    }
    const routingExecution = await routingExecutionRepository.findById(
      event.routingExecutionId,
    );

    if (!routingExecution) {
      throw new Error("Routing execution not found");
    }

    routingExecution.updatePayload(event.payload);

    routingExecution.startProcessing();
    await routingExecutionRepository.update(routingExecution);

    try {
      const params = route.getParams();
      let url = route.getUrl();

      console.log(event);

      if (event.payload.params) {
        Object.keys(params).forEach((key) => {
          url = url.replace(`:${key}`, event.payload.params[key]);
        });
      }

      const response = await axios(url, {
        method: route.getMethod(),
        headers: route.getHeaders(),
        data: JSON.stringify(event.payload),
      });

      routingExecution.completeProcessing();
      routingExecution.updateLogExecution(JSON.stringify(response.data));
      await routingExecutionRepository.update(routingExecution);
      await this.indexRoutingExecution(routingExecution);
    } catch (error: any) {
      routingExecution.failProcessing(error);
      routingExecution.updateLogExecution(JSON.stringify(error));
      await routingExecutionRepository.update(routingExecution);
      await this.indexRoutingExecution(routingExecution);
      return;
    }
  }

  private async indexRoutingExecution(event: RoutingExecution) {
    const routingExecutionSearchIndexer = new RoutingExecutionSearchIndexer();

    await routingExecutionSearchIndexer.handle({
      id: event.getId(),
      routingId: event.getRoutingId(),
      status: event.getStatus(),
      payload: JSON.stringify(event.getPayload()),
      params: JSON.stringify(event.getParams()),
      logExecution: JSON.stringify(event.getLogExecution()),
      createdAt: event.getCreatedAt(),
      updatedAt: event.getUpdatedAt(),
    });
  }
}
