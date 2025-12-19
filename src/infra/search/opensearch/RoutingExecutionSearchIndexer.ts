import { openSearchClient } from "./openSearchClient";

export interface RoutingExecutionSearchIndexerProps {
    id: string;
    routingId: string;
    status: string;
    payload: string;
    params: string;
    logExecution: string;
    updatedAt: Date;
    createdAt: Date;
}

export class RoutingExecutionSearchIndexer {
    async handle(event: RoutingExecutionSearchIndexerProps) {
        await openSearchClient.index({
            index: "routing-executions",
            body: {
                "@timestamp": event.updatedAt,
                success: event.status === "COMPLETED",
                id: event.id,
                routingId: event.routingId,
                payload: event.payload,
                params: event.params,
                logExecution: event.logExecution,
                createdAt: event.createdAt,
            },
            id: event.id,
        });
    }
}
