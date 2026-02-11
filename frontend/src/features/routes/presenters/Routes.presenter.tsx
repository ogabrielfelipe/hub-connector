import PrivateTemplate from "@/shared/components/templates/privateTemplate";
import { Button } from "@/shared/components/ui/button";
import { Ellipsis, Filter, Pencil, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table"

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/shared/components/ui/field"
import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import type { GetGateways200, GetRoutings200, GetRoutings200DocsItem, GetRoutingsParams } from "@/shared/api/hubConnectorAPI";
import { DataPagination } from "@/shared/components/data-pagination";

interface RoutesPresenterProps {
    onSubmitFilter: React.SubmitEventHandler<GetRoutingsParams>;
    routings: GetRoutings200 | null;
    gateways: GetGateways200 | null;
    isLoading: boolean;
    handleDeleteRoute: (id: string) => void;
    handlePageChange: (page: number) => void;
    handlePerPageChange: (perPage: number) => void;
    errors: FieldErrors<GetRoutingsParams>;
    register: UseFormRegister<GetRoutingsParams>;
    control: Control<GetRoutingsParams>;
}

export function RoutesPresenter({ onSubmitFilter, routings, gateways, isLoading, handleDeleteRoute, handlePageChange, handlePerPageChange, errors, register, control }: RoutesPresenterProps) {
    return (
        <PrivateTemplate title="Rotas" isLoading={isLoading} >
            <div className="flex flex-row justify-between items-center gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold">Gestão de Rotas</h1>
                    <p className="text-muted-foreground">Gerenciamento de rotas.</p>
                </div>

                <Button variant="default" asChild>
                    <Link to="/routes/new">
                        <Plus />
                        Nova Rota
                    </Link>
                </Button>
            </div>

            <Card className="mt-4">
                <CardContent>
                    <form onSubmit={onSubmitFilter}>
                        <FieldSet className="mb-4">
                            <FieldLegend className="text-lg font-semibold">Filtros</FieldLegend>
                            <FieldGroup className="flex flex-row gap-4 w-full items-center">
                                <Field orientation="vertical">
                                    <FieldLabel htmlFor="name">Nome</FieldLabel>
                                    <Input id="name" autoComplete="off" type="text" placeholder="Nome da rota" {...register("name")} />
                                    {errors.name && <FieldError>{errors.name.message}</FieldError>}
                                </Field>
                                <Field orientation="vertical">
                                    <FieldLabel htmlFor="gatewayId">Gateway</FieldLabel>
                                    <Controller
                                        name="gatewayId"
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
                                                    {gateways?.docs.map((gateway) => (
                                                        <SelectItem key={gateway.id} value={gateway.id.toString()}>
                                                            {gateway.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}

                                    />
                                </Field>
                            </FieldGroup>
                        </FieldSet>


                        <Field orientation="horizontal">
                            <Button variant="default" className="self-end" type="submit" title="Aplicar filtros">
                                <Filter />
                                Filtrar
                            </Button>
                        </Field>
                    </form>
                </CardContent>
            </Card>


            {/**
             * Users table
             */}
            <Card className="mt-4">
                <CardContent>

                    <Table>
                        <TableCaption>
                            <DataPagination
                                total={routings?.total || 0}
                                page={routings?.page || 1}
                                perPage={routings?.limit || 10}
                                onPageChange={(page) => {
                                    handlePageChange(page)
                                }}
                                onPerPageChange={(perPage) => {
                                    handlePerPageChange(perPage)
                                }}
                            />
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-right"><Ellipsis className="w-4 h-4" /></TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Nome</TableHead>
                                <TableHead>Gateway</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {routings?.docs.map((routing: GetRoutings200DocsItem) => (
                                <TableRow key={routing.id}>
                                    <TableCell className="font-medium flex flex-row gap-2">
                                        <Button variant={"outline"} className="cursor-pointer" title="Editar" asChild>
                                            <Link to={`/routes/edit/${routing.id}`}><Pencil /></Link>
                                        </Button>

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant={"destructive"} className="cursor-pointer" title="Deletar">
                                                    <Trash2 />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Deletar rota</DialogTitle>
                                                    <DialogDescription>
                                                        Tem certeza que deseja deletar esta rota?
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="outline">Cancelar</Button>
                                                    </DialogClose>
                                                    <Button variant="destructive" onClick={() => handleDeleteRoute(routing.id)} disabled={isLoading}>Deletar</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                    <TableCell className="font-medium">{routing.slug}</TableCell>
                                    <TableCell>{routing.name}</TableCell>
                                    <TableCell>{routing.gateway.name}</TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </CardContent>
            </Card>
        </PrivateTemplate>
    )
}