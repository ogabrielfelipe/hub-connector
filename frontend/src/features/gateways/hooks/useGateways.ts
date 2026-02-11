import { deleteGatewaysGatewayId, useGetGateways, type GetGatewaysParams } from "@/shared/api/hubConnectorAPI";
import { useState } from "react";
import { useForm } from "react-hook-form";


export function useGateways() {
    const [isDeleting, setIsDeleting] = useState(false);
    const [queryParams, setQueryParams] = useState<GetGatewaysParams>({
        page: 1,
        limit: 10,
        active: undefined,
    });

    const {
        handleSubmit,
        formState: { errors },
        register,
        control
    } = useForm<GetGatewaysParams>({
        defaultValues: {},
    })

    const getGateways = useGetGateways(queryParams);

    const onSubmitFilter = handleSubmit((data) => {
        setQueryParams((prev) => ({
            ...prev,
            ...data,
            page: 1,
        }));
    })

    async function handleDeleteGateway(id: string) {
        try {
            setIsDeleting(true)
            await deleteGatewaysGatewayId(id)
            await getGateways.refetch();
        } catch (error) {
            console.log(error)
        } finally {
            setIsDeleting(false)
        }
    }

    const handlePageChange = (page: number) => {
        setQueryParams((prev) => ({ ...prev, page }));
    }

    const handlePerPageChange = (perPage: number) => {
        setQueryParams((prev) => ({ ...prev, limit: perPage, page: 1 }));
    }


    return {
        gateways: getGateways.data || null,
        isLoading: getGateways.isLoading || isDeleting,
        handleDeleteGateway,
        handlePageChange,
        handlePerPageChange,
        onSubmitFilter,
        errors,
        register,
        control
    }
}