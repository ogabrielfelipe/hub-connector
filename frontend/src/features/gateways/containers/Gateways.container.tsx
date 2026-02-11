import { useGateways } from "../hooks/useGateways";
import { GatewaysPresenter } from "../presenters/Gateways.presenter";


export function GatewaysContainer() {
    const {
        gateways,
        isLoading,
        handleDeleteGateway,
        handlePageChange,
        handlePerPageChange,
        onSubmitFilter,
        errors,
        register,
        control
    } = useGateways();

    return (
        <GatewaysPresenter
            gateways={gateways}
            isLoading={isLoading}
            handleDeleteGateway={handleDeleteGateway}
            handlePageChange={handlePageChange}
            handlePerPageChange={handlePerPageChange}
            onSubmitFilter={onSubmitFilter}
            errors={errors}
            register={register}
            control={control}
        />
    )
}