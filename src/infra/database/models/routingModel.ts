import { Schema, model } from "mongoose";

export interface RoutingDocument {
  _id: string;
  name: string;
  slug: string;
  description: string;
  gatewayId: string;
  url: string;
  method: string;
  headers: string;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const RoutingSchema = new Schema<RoutingDocument>(
  {
    _id: { type: String },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    gatewayId: { type: String, required: true },
    url: { type: String, required: true },
    method: { type: String, required: true },
    headers: { type: String, required: true },
    deletedAt: { type: Date, required: false, default: null },
  },
  { timestamps: true },
);

export const RoutingModel = model<RoutingDocument>("Routing", RoutingSchema);
