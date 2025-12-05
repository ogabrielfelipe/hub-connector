import z from "zod";

export const CreateGatewaySchema = z.object({
  name: z.string().min(3).max(100),
  routes: z.array(z.string().trim().min(1, "String não pode ser vazia")),
});

export const CreateGatewayResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  xApiKey: z.string(),
  routes: z.array(z.string()),
  active: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const FindOneGatewaySchema = z.object({
  gatewayId: z.uuid(),
});

export const FindAllGatewaySchema = z
  .object({
    name: z.string().optional(),
    active: z.coerce.boolean().optional(),
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(10),
  })
  .optional();

export const FindAllGatewayResponseSchema = z.object({
  docs: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      active: z.boolean(),
    }),
  ),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export const UpdateGatewaySchema = z.object({
  name: z.string().min(3).max(100).optional(),
  active: z.coerce.boolean().optional(),
  routes: z.array(z.uuid()).optional(),
});
export const UpdateGatewayParamsSchema = z.object({
  gatewayId: z.uuid(),
});
export const UpdateGatewayResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  xApiKey: z.string(),
  routes: z.array(z.string()),
  active: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const DeleteGatewaySchema = z.object({
  gatewayId: z.uuid(),
});
