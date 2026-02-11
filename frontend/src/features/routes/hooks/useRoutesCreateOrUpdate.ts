import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { type PostRoutingsBody, type PutRoutingsRoutingIdBody, useGetRoutingsRoutingId, putRoutingsRoutingId, useGetGateways, postRoutings, type PostRoutingsBodyHeaders } from "@/shared/api/hubConnectorAPI";
import type { RouteFormValues } from "../types";


interface Props {
    routingId?: string;
}

export function useRoutesCreateOrUpdate({ routingId }: Props) {
    const navigate = useNavigate();
    const { data: gatewaysData, isLoading: isLoadingGateways } = useGetGateways();
    const methodsForm = useForm<RouteFormValues>({
        defaultValues: {
            name: "",
            slug: "",
            description: "",
            gatewayId: "",
            method: "",
            url: "",
            headers: [
                {
                    key: "Content-Type",
                    value: "application/json"
                }
            ],
        }

    });

    const { data: routing, isLoading: isFetchingRouting } = useGetRoutingsRoutingId(routingId ?? "", {
        query: {
            enabled: !!routingId,
        }
    });


    const { reset } = methodsForm;

    useEffect(() => {
        if (routing && gatewaysData?.docs) {
            console.log(routing)
            reset({
                name: routing.name,
                slug: routing.slug,
                description: routing.description,
                gatewayId: routing.gateway.id,
                headers: Object.entries(routing.headers).map(([key, value]) => ({
                    key,
                    value
                })),
                method: routing.method,
                url: routing.url,
            })

        }
    }, [reset, gatewaysData, routing])

    const onSubmit = methodsForm.handleSubmit(async (data) => {

        const headers = data.headers?.reduce((acc, header) => {
            if (header.key.trim()) {
                acc[header.key] = header.value
            }
            return acc
        }, {} as Record<string, string>)

        if (routingId) {


            try {
                const body: PutRoutingsRoutingIdBody = {
                    name: data.name,
                    slug: data.slug,
                    description: data.description,
                    gatewayId: data.gatewayId,
                    headers: headers,
                    method: data.method,
                    url: data.url,
                }

                await putRoutingsRoutingId(routingId, body)
                toast.success("Rota atualizada com sucesso")
                navigate(`/routes`, { replace: true })
            } catch (error: unknown) {
                const axiosError = error as AxiosError<{ message: string }>;
                toast.error("Erro ao atualizar rota", {
                    description: axiosError?.response?.data?.message,
                })
            }
        } else {


            try {
                const body: PostRoutingsBody = {
                    name: data.name,
                    slug: data.slug,
                    description: data.description,
                    gatewayId: data.gatewayId,
                    headers: headers as PostRoutingsBodyHeaders,
                    method: data.method,
                    url: data.url,
                }

                await postRoutings(body)
                toast.success("Rota criada com sucesso")
                navigate(`/routes`, { replace: true })
            } catch (error: unknown) {
                const axiosError = error as AxiosError<{ message: string }>;
                toast.error("Erro ao criar rota", {
                    description: axiosError?.response?.data?.message,
                })
            }
        }
    }, (errors) => {
        console.log(errors);
    })


    return {
        isLoading: isFetchingRouting || methodsForm.formState.isSubmitting,
        onSubmit,
        gateways: gatewaysData || null,
        methodsForm,
    }
}