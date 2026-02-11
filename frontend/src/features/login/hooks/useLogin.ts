import { postAuthLogin } from "@/shared/api/hubConnectorAPI";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { formLoginSchema, type ErrorLogin, type FormLoginSchema } from "../types";
import { useAuth } from "@/shared/contexts/authContext";
import { useNavigate } from "react-router-dom";


export function useLogin() {
    const [isLoading, setIsLoading] = useState(false)
    const { login, isAuthenticated } = useAuth()
    const navigate = useNavigate();
    const [error, setError] = useState<ErrorLogin | null>(null)

    useEffect(() => {
        document.title = "Login | Hub Connector";
    }, []);

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
            await login(response.token)
            navigate("/", { replace: true });
        } catch (error) {
            console.log(error)
            setError({
                code: 'INVALID_CREDENTIALS',
                message: 'Credenciais inválidas',
                statusCode: 401
            })
        } finally {
            setIsLoading(false)
        }
    });

    useEffect(() => {
        if (errors) {
            setError(errors)
        }
    }, [errors])

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, navigate])

    return {
        register,
        control,
        onSubmit,
        isLoading,
        errors: error
    }
}