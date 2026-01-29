import z from "zod";

export const formLoginSchema = z.object({
    username: z.string().min(3, "Usuário deve ter pelo menos 3 caracteres"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export type FormLoginSchema = z.infer<typeof formLoginSchema>;