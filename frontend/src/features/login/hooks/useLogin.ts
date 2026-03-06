import { getAuthGithub, postAuthGithubCallback, postAuthLogin } from "@/shared/api/hubConnectorAPI";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef, useState } from "react";
import { formLoginSchema, type ErrorLogin, type FormLoginSchema } from "../types";
import { useAuth } from "@/shared/contexts/authContext";
import { useNavigate } from "react-router-dom";

interface useLoginProps {
    code?: string;
    state?: string;
}

export function useLogin({ code, state }: useLoginProps) {
    const [isLoading, setIsLoading] = useState(false)
    const { login, isAuthenticated } = useAuth()
    const navigate = useNavigate();
    const [error, setError] = useState<ErrorLogin | null>(null)

    const windowRef = useRef<Window | null>(null);
    const hasHandledCallback = useRef(false);

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

    const handleLogin = useCallback(async (data: FormLoginSchema) => {
        setIsLoading(true)
        try {
            const response = await postAuthLogin({ password: data.password, username: data.username })
            await login(response.token)
            //navigate("/", { replace: true });
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
    }, [login]);

    const onSubmit = handleSubmit(handleLogin);


    const LoginWithGitHub = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await getAuthGithub()
            window.location.href = response.url
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }, []);

    const submitLoginWithGitHub = useCallback(async (code: string, state: string) => {
        setIsLoading(true)
        try {
            const response = await postAuthGithubCallback({ code, state })
            await login(response.token)
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
    }, [login]);

    useEffect(() => {
        if (code && state && !hasHandledCallback.current) {
            hasHandledCallback.current = true;
            window.history.replaceState({}, document.title, window.location.pathname);

            submitLoginWithGitHub(code, state)
        }
    }, [code, state, submitLoginWithGitHub])


    useEffect(() => {
        if (isAuthenticated) {
            navigate("/", { replace: true });
        }


        if (errors) {
            setError(errors)
        }
    }, [isAuthenticated, navigate, errors])

    return {
        register,
        control,
        onSubmit,
        isLoading,
        LoginWithGitHub,
        errors: error
    }
}