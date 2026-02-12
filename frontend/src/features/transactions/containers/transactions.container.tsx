import { TransactionsPresenter } from "../presenters/transactions.presenter";
import { useTransactions } from "../hooks/useTransactions";


export function TransactionsContainer() {
    const { register, control, errors, onSubmitFilter, routingsSearchExecutions, routings, handlePageChange, handlePerPageChange, isLoading } = useTransactions();
    return (
        <TransactionsPresenter
            register={register}
            control={control}
            errors={errors}
            onSubmitFilter={onSubmitFilter}
            routingsSearchExecutions={routingsSearchExecutions}
            routings={routings}
            isLoading={isLoading}
            handlePageChange={handlePageChange}
            handlePerPageChange={handlePerPageChange}
        />
    )
}