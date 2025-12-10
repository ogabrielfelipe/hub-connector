/* eslint-disable @typescript-eslint/no-explicit-any */
export class OnRoutingExecutionCreatedHandler {
  async handle(event: any) {
    console.log("⚡ Processando RouteExecutionCreated...");
    console.log("Execution ID:", event.routingExecutionId);
    console.log("Route ID:", event.routingId);
    console.log("Payload:", event.payload);

    console.log(event)

    // Aqui pode:
    // - chamar outro caso de uso
    // - disparar processamento assíncrono
    // - enviar para outra fila
    // - enviar webhook
  }
}
