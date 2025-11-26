import z from "zod";

export const CreateUserSchema = z.object({
    name: z.string().min(3).max(100),
    username: z.string().min(3).max(30),
    email: z.email(),
    role: z.enum(["user", "admin", "dev"]),
    password: z.string().min(6).max(100),
})

export const CreateUserResponseSchema = z.object({
    userId: z.string(),
})

export const UpdateUserSchema = z.object({
    name: z.string().min(3).max(100).optional(),
    email: z.email().optional(),
    role: z.enum(["user", "admin", "dev"]).optional(),
    password: z.string().min(6).max(100).optional(),
})

export const UpdateUserResponseSchema = z.object({
    id: z.uuid(),
    name: z.string().min(3).max(100),
    username: z.string().min(3).max(30),
    email: z.email(),
    role: z.enum(["user", "admin", "dev"]),
})