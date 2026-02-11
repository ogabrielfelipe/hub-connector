import z from "zod"


export const GatewayCreateOrUpdateFormSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    active: z.boolean(),
})

export type GatewayCreateOrUpdateForm = z.infer<typeof GatewayCreateOrUpdateFormSchema>