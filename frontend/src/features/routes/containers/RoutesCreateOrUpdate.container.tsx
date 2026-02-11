import { useParams } from "react-router-dom";
import { RoutesCreateOrUpdatePresenter } from "../presenters/RoutesCreateOrUpdate.presenter";
import { useRoutesCreateOrUpdate } from "../hooks/useRoutesCreateOrUpdate";


export function RoutesCreateOrUpdateContainer() {

    const { id } = useParams<{ id: string }>()
    const isEdit = Boolean(id)

    const {
        onSubmit,
        isLoading,
        gateways,
        methodsForm,
    } = useRoutesCreateOrUpdate({ routingId: id })

    return (
        <RoutesCreateOrUpdatePresenter
            onSubmit={onSubmit}
            isEdit={isEdit}
            isLoading={isLoading}
            gateways={gateways}
            methodsForm={methodsForm}
        />
    )
}