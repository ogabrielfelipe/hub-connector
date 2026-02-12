import type { GetRoutingsRoutingId200, GetRoutingsSearchExecutions200 } from "@/shared/api/hubConnectorAPI";
import PrivateTemplate from "@/shared/components/templates/privateTemplate";
import type { TransactionExecution } from "../type";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";


interface ShowTransactionPresenterProps {
    transaction: GetRoutingsSearchExecutions200 | null
    isLoading: boolean
    error: unknown
    routing: GetRoutingsRoutingId200 | null
}

export function ShowTransactionPresenter({ transaction, isLoading, error, routing }: ShowTransactionPresenterProps) {
    const transactionData: TransactionExecution | null = (transaction?.items[0] as TransactionExecution) || null

    return (
        <PrivateTemplate title="Detalhes da Transação" isLoading={isLoading}>
            <div className="flex flex-row justify-between items-center gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold">Detalhes da Transação</h1>
                    <p className="text-muted-foreground">Visualize e analise o fluxo de requisições em tempo real.</p>
                </div>
            </div>


            <Card>
                <CardContent className="flex flex-col gap-4">


                    <h2 className="text-lg font-semibold">Informações Gerais</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2 space-y-1">
                            <Label htmlFor="idTransaction">ID da Transação</Label>
                            <Input
                                id="idTransaction"
                                type="text"
                                placeholder="ID da Transação"
                                value={transactionData?.id}
                                readOnly
                            />
                        </div>


                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col gap-2 space-y-1">
                            <Label htmlFor="slugRouting">Rota</Label>
                            <Input
                                id="slugRouting"
                                type="text"
                                placeholder="Slug da Rota"
                                value={routing?.slug}
                                readOnly
                            />
                        </div>
                        <div className="flex flex-col gap-2 space-y-1">
                            <Label htmlFor="method">Método</Label>
                            <Input
                                id="method"
                                type="text"
                                placeholder="Método"
                                value={routing?.method}
                                readOnly
                            />
                        </div>

                        <div className="flex flex-col gap-2 space-y-1">
                            <Label htmlFor="nameRouting">Nome da Rota</Label>
                            <Input
                                id="nameRouting"
                                type="text"
                                placeholder="Nome da Rota"
                                value={routing?.name}
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex flex-col gap-2 space-y-1">
                            <Label htmlFor="gatewayId">Gateway</Label>
                            <Input
                                id="gatewayId"
                                type="text"
                                placeholder="Gateway"
                                value={routing?.gateway.name}
                                readOnly
                            />
                        </div>
                    </div>

                    <Separator orientation="horizontal" className="my-4" />

                    <h2 className="text-lg font-semibold">Dados da Transação</h2>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col gap-2 space-y-1">
                            <Label htmlFor="latency">Latência</Label>
                            <Input
                                id="latency"
                                type="text"
                                placeholder="Latência"
                                value={transactionData?.latency}
                                readOnly
                            />
                        </div>
                        <div className="flex flex-col gap-2 space-y-1">
                            <Label htmlFor="status">Status da API</Label>
                            <Input
                                id="status"
                                type="text"
                                placeholder="Status da API"
                                value={transactionData?.statusReturnAPI}
                                readOnly
                            />
                        </div>
                        <div className="flex flex-col gap-2 space-y-1">
                            <Label htmlFor="status">Status da Transação</Label>
                            <Input
                                id="status"
                                type="text"
                                placeholder="Status da Transação"
                                value={transactionData?.status === 'COMPLETED' ? 'Completo' : transactionData?.status === 'PENDING' ? 'Em andamento' : 'Com Error'}
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex flex-col gap-2 space-y-1">
                            <Label htmlFor="url">Url</Label>
                            <Input
                                id="url"
                                type="text"
                                placeholder="Url"
                                value={transactionData?.url}
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card">
                        <div className="px-4 py-3 border-b">
                            <h3 className="text-sm font-semibold">Headers</h3>
                        </div>

                        <div className="divide-y">
                            {Object.entries(routing?.headers ?? {}).map(([key, value]) => (
                                <div
                                    key={key}
                                    className="flex items-center justify-between px-4 py-3 text-sm"
                                >
                                    <span className="font-mono text-muted-foreground">
                                        {key}
                                    </span>

                                    <span className="font-mono bg-muted px-2 py-1 rounded text-xs">
                                        {String(value)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>


                    <div className="grid md:grid-cols-2 gap-6 p-6 bg-muted/20">
                        <div>
                            <h4 className="text-sm font-semibold mb-3 text-muted-foreground">
                                Payload da Requisição
                            </h4>

                            <div className="bg-slate-950 text-slate-100 rounded-xl p-4 text-xs overflow-auto">
                                <pre>
                                    {JSON.stringify(JSON.parse(transactionData?.payload ?? '{}'), null, 2)}
                                </pre>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold mb-3 text-muted-foreground">
                                Resposta da Requisição
                            </h4>

                            <div className="bg-slate-950 text-red-400 rounded-xl p-4 text-xs overflow-auto">
                                <pre>
                                    {JSON.stringify(JSON.parse(transactionData?.logExecution ?? '{}'), null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>

                </CardContent>
            </Card>

        </PrivateTemplate>
    )
}