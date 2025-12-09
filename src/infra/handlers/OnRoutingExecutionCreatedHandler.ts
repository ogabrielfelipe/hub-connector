/* eslint-disable @typescript-eslint/no-explicit-any */
export class OnRoutingExecutionCreatedHandler {
    async handle(event: any) {
        console.log("⚡ Processando RouteExecutionCreated...");
        console.log("Execution ID:", event.executionId);
        console.log("Route ID:", event.routeId);

        // Aqui pode:
        // - chamar outro caso de uso
        // - disparar processamento assíncrono
        // - enviar para outra fila
        // - enviar webhook
    }
}