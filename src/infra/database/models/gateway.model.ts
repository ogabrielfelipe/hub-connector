import { Schema, model } from "mongoose";

export type GatewayRoutes = {
  id: string;
  path: string;
  destination: string;
};

export interface GatewayDocument {
  _id: string;
  name: string;
  xApiKey: string;
  routes: GatewayRoutes[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GatewaySchema = new Schema<GatewayDocument>(
  {
    _id: { type: String },
    name: { type: String, required: true },
    xApiKey: { type: String, required: true },
    routes: {
      type: [
        {
          id: { type: String, required: true },
          path: { type: String, required: true },
          destination: { type: String, required: true },
        },
      ],
      required: true,
    },
    active: { type: Boolean, required: true, default: true },
  },
  { timestamps: true },
);

export const GatewayModel = model<GatewayDocument>("Gateway", GatewaySchema);
