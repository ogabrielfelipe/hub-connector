import z from "zod";

export const CreateGatewaySchema = z.object({
  name: z.string().min(3).max(100),
});

export const CreateGatewayResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  xApiKey: z.string(),
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
    active: z
      .preprocess((val) => {
        if (val === undefined) return undefined;
        if (val === "true") return true;
        if (val === "false") return false;
        if (val === true || val === false) return val;
        return undefined;
      }, z.boolean().optional())
      .optional(),
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
});
export const UpdateGatewayParamsSchema = z.object({
  gatewayId: z.uuid(),
});
export const UpdateGatewayResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  xApiKey: z.string(),
  active: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const DeleteGatewaySchema = z.object({
  gatewayId: z.uuid(),
});

export const DeleteGatewayResponseSchema = z.object({});
