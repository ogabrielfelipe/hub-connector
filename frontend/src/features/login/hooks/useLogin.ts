import { postAuthLogin } from "@/shared/api/hubConnectorAPI";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { formLoginSchema, type FormLoginSchema } from "../types";
import { useAuth } from "@/shared/contexts/authContext";
import { useNavigate } from "react-router-dom";


export function useLogin() {
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate();

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
            login(response.token)
            navigate("/", { replace: true });
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