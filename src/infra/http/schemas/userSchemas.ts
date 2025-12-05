import z from "zod";

export const CreateUserSchema = z.object({
  name: z.string().min(3).max(100),
  username: z.string().min(3).max(30),
  email: z.email(),
  role: z.enum(["user", "admin", "dev"]),
  password: z.string().min(6).max(100),
});

export const CreateUserResponseSchema = z.object({
  userId: z.string(),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  email: z.email().optional(),
  role: z.enum(["user", "admin", "dev"]).optional(),
  active: z.boolean().optional(),
  password: z.string().min(6).max(100).optional(),
});

export const UpdateUserResponseSchema = z.object({
  id: z.uuid(),
  name: z.string().min(3).max(100),
  username: z.string().min(3).max(30),
  email: z.email(),
  role: z.enum(["user", "admin", "dev"]),
});

export const FindAllUsersSchema = z.object({
  name: z.string().optional(),
  username: z.string().optional(),
  role: z.enum(["user", "admin", "dev"]).optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

export const FindAllUsersResponseSchema = z.object({
  docs: z.array(
    z.object({
      id: z.uuid(),
      name: z.string(),
      username: z.string(),
      role: z.enum(["user", "admin", "dev"]),
      active: z.boolean(),
    }),
  ),
  total: z.number(),
  page: z.coerce.number(),
  limit: z.coerce.number(),
});

export const FindOneUserSchema = z.object({
  id: z.string(),
});

export const FindOneUserResponseSchema = z.object({
  id: z.uuid(),
  name: z.string().min(3).max(100),
  username: z.string().min(3).max(30),
  email: z.email(),
  role: z.enum(["user", "admin", "dev"]),
});
