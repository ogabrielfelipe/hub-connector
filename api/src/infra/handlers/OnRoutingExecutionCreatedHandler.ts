/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import { MongoGatewayRepository } from "../database/repositories/MongoGatewayRepository";
import { MongoRoutingExecutionRepository } from "../database/repositories/MongoRoutingExecutionRepository";
import { MongoRoutingRepository } from "../database/repositories/MongoRoutingRepository";
import { RoutingExecutionSearchIndexer } from "../search/opensearch/RoutingExecutionSearchIndexer";
import { RoutingExecution } from "@/core/domain/routing/entities/RoutingEcxecution";
import { performance } from "node:perf_hooks";

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

    const params = route.getParams();
    let url = route.getUrl();

    let latency = 0;
    let start = 0;
    try {
      if (event.payload.params) {
        Object.keys(params).forEach((key) => {
          url = url.replace(`:${key}`, event.payload.params[key]);
        });
      }

      start = performance.now();
      const response = await axios(url, {
        method: route.getMethod(),
        headers: route.getHeaders(),
        data: JSON.stringify(event.payload),
      });

      const end = performance.now();
      latency = end - start;

      routingExecution.completeProcessing();
      routingExecution.updateLatency(Number(latency.toFixed(4)));
      routingExecution.updateStatusReturnAPI(response.status);
      routingExecution.updateLogExecution(response.data);
      routingExecution.updateUrl(url);
    } catch (error: any) {
      const end = performance.now();
      latency = end - start;
      routingExecution.updateStatusReturnAPI(error.status);
      routingExecution.failProcessing(error.message);
      routingExecution.updateLogExecution(error);
      routingExecution.updateLatency(Number(latency.toFixed(4)));
      routingExecution.updateUrl(url);
    } finally {
      await Promise.all([
        routingExecutionRepository.update(routingExecution),
        this.indexRoutingExecution(routingExecution),
      ]);
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
      latency: event.getLatency() || 0,
      url: event.getUrl() || "",
      statusReturnAPI: event.getStatusReturnAPI() || 0,
      logExecution: JSON.stringify(event.getLogExecution()),
      createdAt: event.getCreatedAt(),
      updatedAt: event.getUpdatedAt(),
    });
  }
}
