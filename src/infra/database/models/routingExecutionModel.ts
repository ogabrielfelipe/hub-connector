import { Schema, model } from "mongoose";

export enum RoutingExecutionStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface LogStatusDocument {
  statusOld: string;
  statusNew: string;
  createdAt: Date;
}

export interface RoutingExecutionDocument {
  _id: string;
  routingId: string;
  status: RoutingExecutionStatus;
  logStatus: LogStatusDocument[];
  payload?: object;
  logExecution?: object;
  errorMessage?: string | null;
  finishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const RoutingExecutionSchema = new Schema<RoutingExecutionDocument>(
  {
    _id: { type: String },
    routingId: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(RoutingExecutionStatus),
      required: true,
    },
    logStatus: [
      {
        statusOld: { type: String, required: true },
        statusNew: { type: String, required: true },
        createdAt: { type: Date, required: true },
      },
    ],
    payload: { type: Object },
    logExecution: { type: Object },
    errorMessage: { type: String },
    finishedAt: { type: Date },
  },
  { timestamps: true },
);

export const RoutingExecutionModel = model<RoutingExecutionDocument>(
  "RoutingExecution",
  RoutingExecutionSchema,
);
