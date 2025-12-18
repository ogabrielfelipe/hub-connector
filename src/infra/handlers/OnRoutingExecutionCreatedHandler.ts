/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import { connectMongo, disconnectMongo } from "../config/mongoConnection";
import { MongoGatewayRepository } from "../database/repositories/MongoGatewayRepository";
import { MongoRoutingExecutionRepository } from "../database/repositories/MongoRoutingExecutionRepository";
import { MongoRoutingRepository } from "../database/repositories/MongoRoutingRepository";

// TODO: Refinar a implemnentação dos params; Implementar monitoração como prometheus e granafa
export class OnRoutingExecutionCreatedHandler {
  async handle(event: any) {
    await connectMongo();

    const gatewayRepository = new MongoGatewayRepository();
    const routingRepository = new MongoRoutingRepository(gatewayRepository);
    const routingExecutionRepository = new MongoRoutingExecutionRepository();



    const route = await routingRepository.findById(event.routingId);

    if (!route) {
      await disconnectMongo();
      throw new Error("Route not found");
    }
    const routingExecution = await routingExecutionRepository.findById(event.routingExecutionId);

    if (!routingExecution) {
      await disconnectMongo();
      throw new Error("Routing execution not found");
    }

    routingExecution.startProcessing();
    await routingExecutionRepository.update(routingExecution);


    try {
      const params = route.getParams();
      let url = route.getUrl();

      console.log(event)

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

    } catch (error: any) {
      routingExecution.failProcessing(error);
      routingExecution.updateLogExecution(JSON.stringify(error));
      await routingExecutionRepository.update(routingExecution);
      await disconnectMongo();
      return;
    }


    await disconnectMongo();
  }
}
