import { getRoutingsRoutingId, useGetRoutingsSearchExecutions, type GetRoutingsRoutingId200 } from "@/shared/api/hubConnectorAPI"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { TransactionExecution } from "../type"

interface useShowTransactionProps {
    id: string | undefined
}

export function useShowTransaction({ id }: useShowTransactionProps) {
    const navigate = useNavigate()

    const [routing, setRouting] = useState<GetRoutingsRoutingId200 | null>(null)

    if (!id) {
        navigate("/transactions")
    }

    const getTransactionById = useGetRoutingsSearchExecutions({ page: 1, perPage: 1, id })

    useEffect(() => {
        if (!getTransactionById.isPending && getTransactionById.data?.items[0]) {
            getRoutingsRoutingId((getTransactionById.data?.items[0] as TransactionExecution).routingId).then((res) => {
                setRouting(res)
            })
        }
    }, [getTransactionById.data, getTransactionById.isPending])



    return {
        transaction: getTransactionById.data || null,
        routing: routing || null,
        isLoading: getTransactionById.isLoading,
        error: getTransactionById.error
    }
}