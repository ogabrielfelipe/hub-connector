import z from "zod";


export const transactionsFormSchema = z.object({
    text: z.string().optional(),
    routingId: z.string().optional(),
    dateRange: z.object({
        from: z.date(),
        to: z.date(),
    }),
})

export type TransactionsForm = z.infer<typeof transactionsFormSchema>


export type TransactionExecution = {
    id: string;
    routingId: string;
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
    latency: number;
    statusReturnAPI: number;
    payload: string;
    logExecution: string;
    url: string;
    createdAt: string;
    updatedAt: string;
}