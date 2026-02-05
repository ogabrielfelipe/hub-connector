import { deleteUsersId, useGetUsers, type GetUsers200 } from "@/shared/api/hubConnectorAPI";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { UserFormValues } from "../types";


export function useUser() {
    const [users, setUsers] = useState<GetUsers200 | unknown>()

    const {
        handleSubmit,
        formState: { errors },
        register,
        control,
        getValues,
    } = useForm<UserFormValues>({
        defaultValues: {
        },
    })

    const {
        limit,
        name,
        page,
        role,
        username,
    } = getValues()

    const getUser = useGetUsers(
        {
            limit: limit || 10,
            name: name || undefined,
            page: page || 1,
            role: role === 'all' ? undefined : role,
            username: username || undefined,
        },
    );

    useEffect(() => {
        async function getUsers() {
            try {
                const response = getUser.data;
                if (response) {
                    setUsers(response)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getUsers()
    }, [getUser])



    const onSubmitFilter = handleSubmit(async (data) => {
        try {
            if (data.role === "all") {
                data.role = undefined
            }

            const response = await getUser.refetch();
            if (response) {
                setUsers(response.data)
                console.log(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    })


    async function handleDeleteUser(id: string) {
        try {
            await deleteUsersId(id)
            getUser.refetch()

        } catch (error) {
            console.log(error)
        }
    }

    return {
        users,
        onSubmitFilter,
        handleDeleteUser,
        errors,
        register,
        control,
    }
}