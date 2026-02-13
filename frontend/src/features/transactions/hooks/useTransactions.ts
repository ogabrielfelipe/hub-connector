import { useState } from "react";
import { transactionsFormSchema, type TransactionExecution, type TransactionsForm } from "../type";
import { useForm } from "react-hook-form";
import { getGatewaysGatewayId, getRoutingsRoutingId, useGetRoutings, useGetRoutingsSearchExecutions, type GetRoutings200DocsItem, type GetRoutingsSearchExecutionsParams } from "@/shared/api/hubConnectorAPI";
import { subDays } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";


export function useTransactions() {
    const [queryParams, setQueryParams] = useState<TransactionsForm | GetRoutingsSearchExecutionsParams>({
        dateRange: {
            from: subDays(new Date(), 1),
            to: new Date(),
        },
        page: 1,
        perPage: 20,
    });

    const {
        handleSubmit,
        formState: { errors },
        register,
        control
    } = useForm<TransactionsForm>({
        resolver: zodResolver(transactionsFormSchema),
        defaultValues: {
            dateRange: {
                from: subDays(new Date(), 1),
                to: new Date(),
            }
        }
    })

    const routingsSearchExecutions = useGetRoutingsSearchExecutions(queryParams);
    const routings = useGetRoutings({ page: 1, limit: 1000 });

    const onSubmitFilter = handleSubmit((data) => {
        const params = {
            ...data,
            from: data.dateRange.from.toISOString(),
            to: data.dateRange.to.toISOString(),
            dateRange: undefined,
            routingId: data.routingId === "2" ? undefined : data.routingId,
        }

        setQueryParams(params);
        routingsSearchExecutions.refetch();
    }, (error) => console.log(error))


    const handlePageChange = (page: number) => {
        setQueryParams((prev) => ({
            ...prev,
            page,
        }));

        routingsSearchExecutions.refetch();
    };

    const handlePerPageChange = (pageSize: number) => {
        setQueryParams((prev) => ({
            ...prev,
            perPage: pageSize,
            page: 1,
        }));

        routingsSearchExecutions.refetch();
    };

    async function handleResendTransaction(id: string) {
        const transaction = (routingsSearchExecutions?.data?.items as TransactionExecution[] | undefined)?.find((transaction) => transaction?.id === id);
        const routing: GetRoutings200DocsItem | undefined = routings?.data?.docs.find((routing: GetRoutings200DocsItem) => routing?.id === transaction?.routingId);

        if (routing && transaction) {
            const gateway = await getGatewaysGatewayId(routing?.gateway.id);
            const routingDetail = await getRoutingsRoutingId(transaction?.routingId);


            const body = {
                ...(JSON.parse(transaction?.payload).params ? { params: JSON.parse(transaction?.payload).params } : {}),
                ...(JSON.parse(transaction?.payload).payload ? { payload: JSON.parse(transaction?.payload).payload } : {}),
            }


            axios.post(import.meta.env.VITE_API_URL + `/routings/${routing?.slug}/execute`, body, {
                headers: {
                    ...(routingDetail?.headers),
                    "x-api-key": gateway?.xApiKey
                }
            }).then((res) => {
                toast.success("Transação reenviada com sucesso!")
                window.open(`/transactions/${res.data.id}`, "_blank")
            }).catch((error) => {
                toast.error("Erro ao reenviar transação!")
                console.log(error)
            })

        }


    }

    return {
        onSubmitFilter,
        errors,
        register,
        control,
        routingsSearchExecutions: routingsSearchExecutions.data || null,
        routings: routings.data || null,
        isLoading: routingsSearchExecutions.isLoading || routings.isLoading,
        handlePageChange,
        handlePerPageChange,
        handleResendTransaction,
    }
}