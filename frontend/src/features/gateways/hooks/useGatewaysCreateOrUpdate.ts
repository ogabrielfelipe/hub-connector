import { postGateways, putGatewaysGatewayId, useGetGatewaysGatewayId, type PostGateways201, type PostGatewaysBody, type PutGatewaysGatewayIdBody } from "@/shared/api/hubConnectorAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { GatewayCreateOrUpdateFormSchema, type GatewayCreateOrUpdateForm } from "../types";


interface Props {
    gatewayId?: string;
}

export function useGatewaysCreateOrUpdate({ gatewayId }: Props) {
    const navigate = useNavigate();
    const [gatewayCreated, setGatewayCreated] = useState<PostGateways201 | null>(null);

    const {
        handleSubmit,
        formState: { errors, isSubmitting },
        register,
        getValues,
        setValue,
        reset,
        control,
    } = useForm<GatewayCreateOrUpdateForm>({
        resolver: zodResolver(GatewayCreateOrUpdateFormSchema),
        defaultValues: {
            active: true,
        }
    });

    const { data: gateway, isLoading: isFetchingGateway } = useGetGatewaysGatewayId(gatewayId ?? "", {
        query: {
            enabled: !!gatewayId,
        }
    });

    useEffect(() => {
        if (gateway) {
            reset({
                name: gateway.name,
                active: gateway.active,
            });
        }
    }, [gateway, reset])


    const onSubmit = handleSubmit(async (data) => {
        console.log(data);
        if (gatewayId) {
            try {
                const body: PutGatewaysGatewayIdBody = {
                    name: data.name,
                    active: data.active,
                }

                await putGatewaysGatewayId(gatewayId, body)
                toast.success("Gateway atualizado com sucesso")
                navigate(`/gateways`, { replace: true })
            } catch (error: unknown) {
                const axiosError = error as AxiosError<{ message: string }>;
                toast.error("Erro ao atualizar gateway", {
                    description: axiosError?.response?.data?.message,
                })
            }
        } else {

            try {
                const body: PostGatewaysBody = {
                    name: data.name,
                }

                const response = await postGateways(body)
                setGatewayCreated(response)
                toast.success("Gateway criado com sucesso")
            } catch (error: unknown) {
                const axiosError = error as AxiosError<{ message: string }>;
                toast.error("Erro ao criar gateway", {
                    description: axiosError?.response?.data?.message,
                })
            }
        }
    }, (errors) => {
        console.log(errors);
    })


    return {
        isLoading: isFetchingGateway || isSubmitting,
        onSubmit,
        errors,
        register,
        getValues,
        setValue,
        reset,
        control,
        gatewayCreated: gatewayCreated || gateway || null,
    }
}