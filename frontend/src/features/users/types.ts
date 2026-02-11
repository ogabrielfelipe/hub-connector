import type { GetUsersParams, GetUsersRole } from "@/shared/api/hubConnectorAPI";
import { z } from "zod";

export type UserFormValues = Omit<GetUsersParams, 'role'> & {
    role?: GetUsersRole | 'all';
};




export const UserCreateOrUpdateFormSchema = z
    .object({
        username: z.string().min(3, "Nome do usuário deve ter pelo menos 3 caracteres."),
        name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres."),
        email: z.email("Email inválido."),
        password: z.string().optional(),
        password_confirmation: z.string().optional(),
        role: z.enum(["admin", "user", "dev"]),
    })
    .superRefine((data, ctx) => {
        const passwordFilled = !!data.password || !!data.password_confirmation;

        // Se começou a preencher senha, valida tudo
        if (passwordFilled) {
            if (!data.password) {
                ctx.addIssue({
                    path: ["password"],
                    message: "Senha obrigatória",
                    code: "custom",
                });
            }

            if (!data.password_confirmation) {
                ctx.addIssue({
                    path: ["password_confirmation"],
                    message: "Confirmação de senha obrigatória",
                    code: "custom",
                });
            }

            if (data.password !== data.password_confirmation) {
                ctx.addIssue({
                    path: ["password_confirmation"],
                    message: "As senhas não coincidem",
                    code: "custom",
                });
            }
        }
    });

export type UserCreateOrUpdateForm = z.infer<typeof UserCreateOrUpdateFormSchema>;
