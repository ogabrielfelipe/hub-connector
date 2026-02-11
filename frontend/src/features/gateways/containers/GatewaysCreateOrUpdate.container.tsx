import { useParams } from "react-router-dom"
import { GatewaysCreateOrUpdatePresenter } from "../presenters/GatewaysCreateOrUpdate.presenter"
import { useGatewaysCreateOrUpdate } from "../hooks/useGatewaysCreateOrUpdate"


export function GatewaysCreateOrUpdateContainer() {
    const { id } = useParams<{ id: string }>()
    const isEdit = Boolean(id)

    const { onSubmit, errors, register, isLoading, gatewayCreated, control } = useGatewaysCreateOrUpdate({ gatewayId: id })

    return (
        <GatewaysCreateOrUpdatePresenter
            isEdit={isEdit}
            onSubmit={onSubmit}
            errors={errors}
            register={register}
            isLoading={isLoading}
            control={control}
            gatewayCreated={gatewayCreated}
        />
    )
}