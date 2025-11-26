import z from "zod";

export const LoginSchema = z.object({
    username: z.string().min(3).max(30),
    password: z.string().min(6).max(100),
})

export const LoginResponseSchema = z.object({
    token: z.string(),
})