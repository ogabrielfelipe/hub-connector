import { useState } from "react";
import { transactionsFormSchema, type TransactionsForm } from "../type";
import { useForm } from "react-hook-form";
import { useGetRoutings, useGetRoutingsSearchExecutions, type GetRoutingsSearchExecutionsParams } from "@/shared/api/hubConnectorAPI";
import { subDays } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";


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
    }
}