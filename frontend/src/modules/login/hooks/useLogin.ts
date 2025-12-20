import { postAuthLogin } from "@/api/hubConnectorAPI";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { formLoginSchema, type FormLoginSchema } from "../types";


export function useLogin() {
    const [isLoading, setIsLoading] = useState(false)

    const {
        handleSubmit,
        formState: { errors },
        register,
        control
    } = useForm<FormLoginSchema>({
        resolver: zodResolver(formLoginSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    })

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true)
        try {
            const response = await postAuthLogin({ password: data.password, username: data.username })
            console.log(response)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    });

    return {
        register,
        control,
        onSubmit,
        isLoading,
        errors
    }
}