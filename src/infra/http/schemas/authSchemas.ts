import z from "zod";

export const LoginSchema = z.object({
    username: z.string().min(3).max(30),
    password: z.string().min(6).max(100),
})

export const LoginResponseSchema = z.object({
    token: z.string(),
})


export const MeResponseSchema = z.object({
        id: z.string(),
        name: z.string(),
        username: z.string(),
        email: z.string().email(),
        role: z.string(),
})