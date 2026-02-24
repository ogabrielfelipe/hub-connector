import { useParams } from "react-router-dom";
import { ShowTransactionPresenter } from "../presenters/showTransaction.presenter";
import { useShowTransaction } from "../hooks/useShowTransaction";


export function ShowTransactionContainer() {
    const { id } = useParams<{ id: string }>()

    const { transaction, isLoading, routing } = useShowTransaction({ id })

    return (
        <ShowTransactionPresenter transaction={transaction} isLoading={isLoading} routing={routing} />
    )
}
