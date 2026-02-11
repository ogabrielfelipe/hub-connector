import { useGetUsersId, postUsers, putUsersId, type PostUsersBody, type PutUsersIdBody } from "@/shared/api/hubConnectorAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { UserCreateOrUpdateFormSchema, type UserCreateOrUpdateForm } from "../types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";


interface Props {
    userId?: string;
}

export function useUserCreateOrUpdate({ userId }: Props) {
    const navigate = useNavigate();

    const {
        handleSubmit,
        formState: { errors, isSubmitting },
        register,
        control,
        getValues,
        setValue,
        reset,
    } = useForm<UserCreateOrUpdateForm>({
        resolver: zodResolver(UserCreateOrUpdateFormSchema),
        defaultValues: {
            username: "",
            name: "",
            email: "",
            role: "user",
            password: "",
            password_confirmation: ""
        },
    });

    const { data: user, isLoading: isFetchingUser } = useGetUsersId(userId ?? "", {
        query: {
            enabled: !!userId,
        }
    });

    useEffect(() => {
        if (user) {
            reset({
                username: user.username,
                name: user.name,
                email: user.email,
                role: user.role,
                password: "",
                password_confirmation: ""
            });
        }
    }, [user, reset])


    const onSubmit = handleSubmit(async (data) => {
        if (userId) {
            try {
                const body: PutUsersIdBody = {
                    name: data.name,
                    email: data.email,
                    password: data.password ? data.password : undefined,
                    role: data.role
                }

                await putUsersId(userId, body)
                toast.success("Usuário atualizado com sucesso")
                navigate(`/users`, { replace: true })
            } catch (error: unknown) {
                const axiosError = error as AxiosError<{ message: string }>;
                toast.error("Erro ao atualizar usuário", {
                    description: axiosError?.response?.data?.message,
                })
            }
        } else {

            try {
                const body: PostUsersBody = {
                    username: data.username,
                    name: data.name,
                    email: data.email,
                    password: data.password as string,
                    role: data.role
                }

                await postUsers(body)
                toast.success("Usuário criado com sucesso")
                navigate(`/users`, { replace: true })
            } catch (error: unknown) {
                const axiosError = error as AxiosError<{ message: string }>;
                toast.error("Erro ao criar usuário", {
                    description: axiosError?.response?.data?.message,
                })
            }
        }

    })


    return {
        onSubmit,
        errors,
        register,
        control,
        getValues,
        setValue,
        isLoading: isFetchingUser || isSubmitting,
    }
}