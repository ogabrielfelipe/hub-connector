import { deleteUsersId, useGetUsers, type GetUsersParams } from "@/shared/api/hubConnectorAPI";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { UserFormValues } from "../types";


export function useUser() {
    const [isDeleting, setIsDeleting] = useState(false);
    const [queryParams, setQueryParams] = useState<GetUsersParams>({
        page: 1,
        limit: 10,
    });

    const {
        handleSubmit,
        formState: { errors },
        register,
        control
    } = useForm<UserFormValues>({
        defaultValues: {},
    })

    const getUser = useGetUsers(queryParams);

    const onSubmitFilter = handleSubmit((data) => {
        setQueryParams((prev) => ({
            ...prev,
            ...data,
            role: data.role === 'all' ? undefined : data.role,
            page: 1,
        }));
    })

    async function handleDeleteUser(id: string) {
        try {
            setIsDeleting(true)
            await deleteUsersId(id)
            await getUser.refetch();
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
        users: getUser.data ?? null,
        isLoading: getUser.isLoading || isDeleting,
        onSubmitFilter,
        handleDeleteUser,
        handlePageChange,
        handlePerPageChange,
        errors,
        register,
        control,
    }
}