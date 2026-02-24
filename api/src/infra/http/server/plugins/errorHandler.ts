/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyInstance } from "fastify";
import { NotPermissionError } from "@/core/application/errors/NotPermissionError";
import { DomainError } from "@/core/domain/errors/DomainError";
import { WinstonLoggerService } from "@/infra/logger/winston-logger.service";



const logger = new WinstonLoggerService();

function configureErrorHandler(app: FastifyInstance) {
    app.setErrorHandler((error, _req, reply) => {
        if (error instanceof NotPermissionError || error instanceof DomainError) {
            return reply.status(error.statusCode).send({
                message: error.message,
                timestamp: error.timestamp,
            });
        }

        if ((error as any).validation) {
            logger.warn(`Validation error: ${(error as any).message}`, { error });
            return reply.status(400).send({ error: (error as any).message });
        }

        logger.error(`Unexpected error: ${(error as any).message}`, { error });

        return reply.status(500).send({
            message: (error as any).message ?? "Internal server error",
        });
    });
}

export function registerErrorHandler(app: FastifyInstance) {
    configureErrorHandler(app);
}