import z from "zod";

export const delPrefixCacheSchema = z.object({
  prefix: z.string(),
});

export const delPrefixCacheResponseSchema = z.object({});
