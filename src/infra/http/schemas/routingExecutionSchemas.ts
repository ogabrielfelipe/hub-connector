import { z } from "zod";

export const createRoutingExecutionParamsSchema = z.object({
  routingSlug: z.string(),
});

export const createRoutingExecutionSchema = z.object({
  payload: z.any().optional(),
});

export const createRoutingExecutionResponseSchema = z.object({
  id: z.string(),
  routingId: z.string(),
  status: z.string(),
  createdAt: z.date(),
});
