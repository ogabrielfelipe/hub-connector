/* eslint-disable @typescript-eslint/no-explicit-any */
import { ILogger } from "@/core/application/ports/logger.port";
import { logger } from "./logger.factory";

export class WinstonLoggerService implements ILogger {
  info(message: string, context?: any): void {
    logger.info(message, context);
  }
  error(message: string, context?: any): void {
    logger.error(message, context);
  }
  warn(message: string, context?: any): void {
    logger.warn(message, context);
  }
  debug(message: string, context?: any): void {
    logger.debug(message, context);
  }
}
