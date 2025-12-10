import { Schema, model } from "mongoose";

export interface GatewayDocument {
  _id: string;
  name: string;
  xApiKey: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GatewaySchema = new Schema<GatewayDocument>(
  {
    _id: { type: String },
    name: { type: String, required: true },
    xApiKey: { type: String, required: true },
    active: { type: Boolean, required: true, default: true },
  },
  { timestamps: true },
);

GatewaySchema.index({ xApiKey: 1 })

export const GatewayModel = model<GatewayDocument>("Gateway", GatewaySchema);
