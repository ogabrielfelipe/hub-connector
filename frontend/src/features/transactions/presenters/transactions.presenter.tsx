import PrivateTemplate from "@/shared/components/templates/privateTemplate";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/shared/components/ui/card";
import { Filter } from "lucide-react";
import { DatePickerWithRange } from "./components/date-picker-range";
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import type { TransactionExecution, TransactionsForm } from "../type";
import type { GetRoutings200, GetRoutingsSearchExecutions200 } from "@/shared/api/hubConnectorAPI";
import { RequestLogItem } from "./components/Request-log-item";
import { DataPagination } from "@/shared/components/data-pagination";


interface TransactionsPresenterProps {
    register: UseFormRegister<TransactionsForm>;
    control: Control<TransactionsForm>;
    errors: FieldErrors<TransactionsForm>;
    onSubmitFilter: React.SubmitEventHandler<HTMLFormElement>;
    routingsSearchExecutions: GetRoutingsSearchExecutions200 | null;
    routings: GetRoutings200 | null;
    handlePageChange: (page: number) => void;
    handlePerPageChange: (pageSize: number) => void;
    isLoading: boolean;
    handleResendTransaction: (id: string) => void;
}

export function TransactionsPresenter({ register, control, errors, onSubmitFilter, routingsSearchExecutions, routings, handlePageChange, handlePerPageChange, isLoading, handleResendTransaction }: TransactionsPresenterProps) {
    return (
        <PrivateTemplate title="Logs de Transações" isLoading={isLoading}>
            <div className="flex flex-row justify-between items-center gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold">Logs de Transações</h1>
                    <p className="text-muted-foreground">Visualize e analise o fluxo de requisições em tempo real.</p>
                </div>

            </div>

            <form onSubmit={onSubmitFilter}>
                <Card className="mt-4">
                    <CardContent>

                        <FieldSet className="mb-4">
                            <FieldLegend className="text-lg font-semibold">Filtros</FieldLegend>
                            <FieldGroup className="flex flex-row gap-4 w-full items-center">
                                <DatePickerWithRange control={control} errors={errors} />
                                <Field orientation="vertical">
                                    <FieldLabel htmlFor="text">Parâmetro</FieldLabel>
                                    <Input id="text" autoComplete="off" type="text" placeholder="Busque por ID, payload ou resposta" {...register("text")} />
                                    {errors.text && <FieldError>{errors.text.message}</FieldError>}
                                </Field>
                                <Field orientation="vertical">
                                    <FieldLabel htmlFor="routingId">Rota</FieldLabel>
                                    <Controller
                                        name="routingId"
                                        control={control}
                                        defaultValue={"2"}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value?.toString()}
                                                onValueChange={(value) => {
                                                    field.onChange(value === "2" ? undefined : value);
                                                }}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Todos" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    <SelectItem value="2">Todos</SelectItem>
                                                    {routings?.docs.map((route) => (
                                                        <SelectItem key={route.id} value={route.id.toString()}>
                                                            {route.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}

                                    />
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">
                            <Filter />
                            Filtrar
                        </Button>
                    </CardFooter>
                </Card>
            </form>

            <div className="flex flex-col gap-4 mt-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-6 text-sm w-full justify-evenly">
                            <span className="text-muted-foreground font-semibold">
                                Status API
                            </span>

                            <span className="text-muted-foreground font-semibold">
                                Data
                            </span>

                            <span className="text-muted-foreground font-semibold">
                                Método
                            </span>

                            <span className="font-semibold text-muted-foreground">Nome da Rota
                                <h6 className="text-muted-foreground text-xs">URL</h6>
                            </span>

                            <span className="text-muted-foreground font-semibold ">
                                Latência <h6 className="text-muted-foreground text-xs inline-block">(ms)</h6>
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent>

                        {(routingsSearchExecutions?.items as TransactionExecution[])?.map((execution) => {
                            const route = routings?.docs.find((r) => r.id === execution?.routingId);
                            return (
                                <RequestLogItem
                                    key={execution?.id}
                                    id={execution?.id}
                                    status={execution?.statusReturnAPI}
                                    timestamp={execution?.createdAt}
                                    method={route?.method || ""}
                                    route={{ url: execution?.url || "", name: route?.name || "" }}
                                    latency={Number(execution?.latency).toFixed(4).toString() || ""}
                                    requestPayload={JSON.parse(execution?.payload)}
                                    responseTrace={JSON.parse(execution?.logExecution)}
                                    handleResendTransaction={handleResendTransaction}

                                />
                            )
                        })}
                    </CardContent>
                    <CardFooter>
                        <DataPagination
                            total={routingsSearchExecutions?.total || 0}
                            page={routingsSearchExecutions?.page || 1}
                            perPage={routingsSearchExecutions?.perPage || 20}
                            onPageChange={(page) => {
                                handlePageChange(page)
                            }}
                            onPerPageChange={(perPage) => {
                                handlePerPageChange(perPage)
                            }}
                        />
                    </CardFooter>

                </Card>
            </div>

        </PrivateTemplate>
    )
}