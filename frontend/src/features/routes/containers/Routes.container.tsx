import { RoutesPresenter } from "../presenters/Routes.presenter";
import { useRoutes } from "../hooks/useRoutes";


export function RoutesContainer() {

    const {
        onSubmitFilter,
        routings,
        gateways,
        isLoading,
        handleDeleteRoute,
        handlePageChange,
        handlePerPageChange,
        errors,
        register,
        control
    } = useRoutes();

    return (
        <RoutesPresenter
            onSubmitFilter={onSubmitFilter}
            routings={routings}
            gateways={gateways}
            isLoading={isLoading}
            handleDeleteRoute={handleDeleteRoute}
            handlePageChange={handlePageChange}
            handlePerPageChange={handlePerPageChange}
            errors={errors}
            register={register}
            control={control}
        />
    )
}