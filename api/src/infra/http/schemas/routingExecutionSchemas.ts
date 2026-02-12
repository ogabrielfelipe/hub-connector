import { z } from "zod";

export const createRoutingExecutionParamsSchema = z.object({
  routingSlug: z.string(),
});

export const createRoutingExecutionSchema = z.object({
  payload: z.any().optional(),
  params: z.record(z.string(), z.any()).optional(),
});

export const createRoutingExecutionResponseSchema = z.object({
  id: z.string(),
  routingId: z.string(),
  status: z.string(),
  createdAt: z.date(),
});

export const searchRoutingExecutionParamsSchema = z.object({
  routingId: z.string().optional(),
  id: z.string().optional(),
  status: z.string().optional(),
  text: z.string().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  page: z.coerce.number().default(1),
  perPage: z.coerce.number().default(20),
});

export const searchRoutingExecutionResponseSchema = z.object({
  items: z.array(z.any()),
  total: z.number(),
  page: z.number(),
  perPage: z.number(),
});
