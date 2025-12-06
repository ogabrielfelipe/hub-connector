/**
interface FindAllRoutingUseCaseCommand {
    gatewayId?: string;
    name?: string;
    page: number;
    limit: number;
}

} */

import z from "zod";

export const CreateRoutingSchema = z.object({
  name: z.string(),
  description: z.string(),
  gatewayId: z.uuid(),
  url: z.string(),
  method: z.string(),
  headers: z.record(z.string(), z.string()),
});

export const CreateRoutingResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  gatewayId: z.string(),
  url: z.string(),
  method: z.string(),
  headers: z.record(z.string(), z.string()),
});

export const UpdateRoutingSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  gatewayId: z.string().optional(),
  url: z.string().optional(),
  method: z.string().optional(),
  headers: z.record(z.string(), z.string()).optional(),
});

export const UpdateRoutingResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  gatewayId: z.string(),
  url: z.string(),
  method: z.string(),
  headers: z.record(z.string(), z.string()),
});

export const FindOneRoutingSchema = z.object({
  routingId: z.string(),
});

export const FindOneRoutingResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  gateway: z.object({
    id: z.uuid(),
    name: z.string(),
    xApiKey: z.string(),
    active: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
  url: z.string(),
  method: z.string(),
  headers: z.record(z.string(), z.string()),
});

export const FindAllRoutingSchema = z.object({
  gatewayId: z.string().optional(),
  name: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

export const FindAllRoutingResponseSchema = z.object({
  docs: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      gateway: z.object({
        id: z.uuid(),
        name: z.string(),
      }),
      deletedAt: z.union([z.date(), z.null()]),
    }),
  ),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});
