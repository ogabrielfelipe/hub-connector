import { AggregateRoot } from "@/core/domain/routing/AggregateRoot";
import { v4 as uuidV4 } from "uuid";
import { RoutingExecutionCreated } from "../events/RoutingExecutionCreated";

export enum RoutingExecutionStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export type LogStatusType = {
  statusOld: RoutingExecutionStatus;
  statusNew: RoutingExecutionStatus;
  createdAt: Date;
};

export class RoutingExecution extends AggregateRoot {
  private id: string;
  private routingId: string;
  private status: RoutingExecutionStatus;
  private logStatus: LogStatusType[];
  private params?: unknown;
  private payload?: unknown;
  private logExecution?: unknown;
  private errorMessage?: string | null;
  private finishedAt?: Date | null;
  private createdAt: Date;
  private updatedAt: Date;

  private constructor(
    id: string,
    routingId: string,
    status: RoutingExecutionStatus,
    logStatus: LogStatusType[],
    createdAt: Date,
    updatedAt: Date,
    params?: unknown,
    payload?: unknown,
    logExecution?: unknown,
    errorMessage?: string | null,
    finishedAt?: Date | null,
  ) {
    super();
    this.id = id;
    this.routingId = routingId;
    this.status = status;
    this.logStatus = logStatus;
    this.params = params;
    this.payload = payload;
    this.logExecution = logExecution;
    this.errorMessage = errorMessage;
    this.finishedAt = finishedAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static create(
    routingId: string,
    status: RoutingExecutionStatus,
    logStatus: LogStatusType[],
    params?: unknown,
    payload?: unknown,
    logExecution?: unknown,
    errorMessage?: string | null,
    finishedAt?: Date | null,
  ) {
    const id = uuidV4();
    const createdAt = new Date();
    const updatedAt = new Date();

    const routingExecution = new RoutingExecution(
      id,
      routingId,
      status,
      logStatus,
      createdAt,
      updatedAt,
      params,
      payload,
      logExecution,
      errorMessage,
      finishedAt,
    );

    routingExecution.addDomainEvent(
      new RoutingExecutionCreated(id, routingId, { payload, params }),
    );

    return routingExecution;
  }

  public static createWithoutDomainEvent(
    routingId: string,
    status: RoutingExecutionStatus,
    logStatus: LogStatusType[],
    params?: unknown,
    payload?: unknown,
    logExecution?: unknown,
    errorMessage?: string | null,
    finishedAt?: Date | null,
  ) {
    const id = uuidV4();
    const createdAt = new Date();
    const updatedAt = new Date();

    const routingExecution = new RoutingExecution(
      id,
      routingId,
      status,
      logStatus,
      createdAt,
      updatedAt,
      params,
      payload,
      logExecution,
      errorMessage,
      finishedAt,
    );

    return routingExecution;
  }

  public static fromPersistence(
    id: string,
    routingId: string,
    status: RoutingExecutionStatus,
    logStatus: LogStatusType[],
    createdAt: Date,
    updatedAt: Date,
    params?: unknown,
    payload?: unknown,
    logExecution?: unknown,
    errorMessage?: string,
    finishedAt?: Date,
  ) {
    return new RoutingExecution(
      id,
      routingId,
      status,
      logStatus,
      createdAt,
      updatedAt,
      params,
      payload,
      logExecution,
      errorMessage,
      finishedAt,
    );
  }

  public getId(): string {
    return this.id;
  }

  public getRoutingId(): string {
    return this.routingId;
  }

  public getStatus(): RoutingExecutionStatus {
    return this.status;
  }

  public getLogStatus(): LogStatusType[] {
    return this.logStatus;
  }

  public getParams(): unknown {
    return this.params;
  }

  public getPayload(): unknown {
    return this.payload;
  }

  public getLogExecution(): unknown {
    return this.logExecution;
  }

  public getErrorMessage(): string | null | undefined {
    return this.errorMessage;
  }

  public getFinishedAt(): Date | null | undefined {
    return this.finishedAt;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public startProcessing(): void {
    this.updateStatus(RoutingExecutionStatus.PROCESSING);
  }

  public completeProcessing(): void {
    if (this.status !== RoutingExecutionStatus.PROCESSING) {
      throw new Error("Routing execution is not in PROCESSING state");
    }
    this.updateStatus(RoutingExecutionStatus.COMPLETED);
    this.updateFinishedAt(new Date());
    this.updatedAt = new Date();
  }

  public failProcessing(errorMessage: string): void {
    if (this.status !== RoutingExecutionStatus.PROCESSING) {
      throw new Error("Routing execution is not in PROCESSING state");
    }
    this.updateStatus(RoutingExecutionStatus.FAILED);
    this.updateErrorMessage(errorMessage);
    this.updatedAt = new Date();
  }

  private updateStatus(status: RoutingExecutionStatus): void {
    const logStatus: LogStatusType = {
      statusOld: this.status,
      statusNew: status,
      createdAt: new Date(),
    };

    this.logStatus.push(logStatus);
    this.status = status;
    this.updatedAt = new Date();
  }

  public updateLogExecution(logExecution: unknown): void {
    this.logExecution = logExecution;
    this.updatedAt = new Date();
  }

  public updateErrorMessage(errorMessage: string): void {
    this.errorMessage = errorMessage;
    this.updatedAt = new Date();
  }

  public updateFinishedAt(finishedAt: Date): void {
    this.finishedAt = finishedAt;
    this.updatedAt = new Date();
  }
}
