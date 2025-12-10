/* eslint-disable @typescript-eslint/no-explicit-any */

// TODO: Implementar a chamada de API para envio na rota indicada no routingId
export class OnRoutingExecutionCreatedHandler {
  async handle(event: any) {
    console.log("⚡ Processando RouteExecutionCreated...");
    console.log("Execution ID:", event.routingExecutionId);
    console.log("Route ID:", event.routingId);
    console.log("Payload:", event.payload);
  }
}
