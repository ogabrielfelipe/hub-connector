import type { FieldErrors } from "react-hook-form";
import z from "zod";

export const formLoginSchema = z.object({
    username: z.string().min(3, "Usuário deve ter pelo menos 3 caracteres"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export type FormLoginSchema = z.infer<typeof formLoginSchema>;


export type ErrorLogin = {
    code: string
    message: string
    statusCode: number
} | null | FieldErrors<FormLoginSchema>;


export function isFieldErrors(error: ErrorLogin): error is FieldErrors<FormLoginSchema> {
    return error !== null && !('statusCode' in error);
}

export function isErrorLogin(error: ErrorLogin): error is Exclude<ErrorLogin, FieldErrors<FormLoginSchema>> {
    return error !== null && 'statusCode' in error;
}
