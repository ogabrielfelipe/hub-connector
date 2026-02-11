import { deleteRoutingsRoutingId, useGetGateways, useGetRoutings, type GetRoutingsParams } from "@/shared/api/hubConnectorAPI";
import { useState } from "react";
import { useForm } from "react-hook-form";


export function useRoutes() {

    const [isDeleting, setIsDeleting] = useState(false);
    const [queryParams, setQueryParams] = useState<GetRoutingsParams>({
        page: 1,
        limit: 10,
    });

    const {
        handleSubmit,
        formState: { errors },
        register,
        control
    } = useForm<GetRoutingsParams>({
        defaultValues: {},
    })


    const getRoutings = useGetRoutings(queryParams);
    const getGateways = useGetGateways();

    const onSubmitFilter = handleSubmit((data) => {
        setQueryParams((prev) => ({
            ...prev,
            ...data,
            page: 1,
        }));
    }, (error) => console.log(error))

    async function handleDeleteRoute(id: string) {
        try {
            setIsDeleting(true)
            await deleteRoutingsRoutingId(id)
            await getRoutings.refetch();
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
        onSubmitFilter,
        routings: getRoutings.data || null,
        gateways: getGateways.data || null,
        isLoading: getRoutings.isLoading || isDeleting,
        handleDeleteRoute,
        handlePageChange,
        handlePerPageChange,
        errors,
        register,
        control,
    }
}