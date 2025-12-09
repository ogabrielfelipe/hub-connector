import { RoutingExecution, RoutingExecutionStatus, LogStatusType } from "@/core/domain/routing/entities/RoutingEcxecution";
import { RoutingExecutionDocument, LogStatusDocument } from "../models/routingExecutionModel";

export class RoutingExecutionConverter {
    public toDomain(routingExecution: RoutingExecutionDocument): RoutingExecution {
        // Convert the status string from database to enum
        // Since the enum values match the keys (PENDING = "PENDING"), we can use type assertion
        const status = routingExecution.status as RoutingExecutionStatus;

        // Convert logStatus from database documents to domain types
        const logStatus: LogStatusType[] = routingExecution.logStatus.map((log) => ({
            statusOld: log.statusOld as RoutingExecutionStatus,
            statusNew: log.statusNew as RoutingExecutionStatus,
            createdAt: log.createdAt,
        }));

        return RoutingExecution.fromPersistence(
            routingExecution._id.toString(),
            routingExecution.routingId,
            status,
            logStatus,
            routingExecution.createdAt,
            routingExecution.updatedAt,
            routingExecution.payload,
            routingExecution.logExecution,
            routingExecution.errorMessage || undefined,
            routingExecution.finishedAt || undefined,
        );
    }

    public toPersistence(routingExecution: RoutingExecution): Partial<RoutingExecutionDocument> {
        // Convert logStatus from domain types to database documents
        const logStatus: LogStatusDocument[] = routingExecution.getLogStatus().map((log) => ({
            statusOld: log.statusOld, // Enum value is already a string
            statusNew: log.statusNew, // Enum value is already a string
            createdAt: log.createdAt,
        }));

        return {
            _id: routingExecution.getId(),
            routingId: routingExecution.getRoutingId(),
            status: routingExecution.getStatus(), // Enum value is already a string
            logStatus,
            payload: routingExecution.getPayload() as object | undefined,
            logExecution: routingExecution.getLogExecution() as object | undefined,
            errorMessage: routingExecution.getErrorMessage() || undefined,
            finishedAt: routingExecution.getFinishedAt() || undefined,
            createdAt: routingExecution.getCreatedAt(),
            updatedAt: routingExecution.getUpdatedAt(),
        };
    }
}
