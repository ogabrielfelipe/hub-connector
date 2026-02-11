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
import { DataPagination } from "@/shared/components/data-pagination";
import type { GetGateways200, GetGateways200DocsItem, GetGatewaysParams } from "@/shared/api/hubConnectorAPI";
import type React from "react";

interface GatewaysPresenterProps {
    onSubmitFilter: React.SubmitEventHandler<GetGatewaysParams>;
    gateways: GetGateways200 | null;
    isLoading: boolean;
    handleDeleteGateway: (id: string) => void;
    handlePageChange: (page: number) => void;
    handlePerPageChange: (perPage: number) => void;
    errors: FieldErrors<GetGatewaysParams>;
    register: UseFormRegister<GetGatewaysParams>;
    control: Control<GetGatewaysParams>;
}

export function GatewaysPresenter({
    gateways,
    isLoading,
    handleDeleteGateway,
    handlePageChange,
    handlePerPageChange,
    onSubmitFilter,
    errors,
    register,
    control
}: GatewaysPresenterProps) {
    return (
        <PrivateTemplate title="Gateways" isLoading={isLoading}>
            <div className="flex flex-row justify-between items-center gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold">Gestão de Gateways</h1>
                    <p className="text-muted-foreground">Gerenciamento de gateways.</p>
                </div>

                <Button variant="default" asChild>
                    <Link to="/gateways/new">
                        <Plus />
                        Novo Gateway
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
                                    <Input id="name" autoComplete="off" type="text" placeholder="Nome do gateway" {...register("name")} />
                                    {errors.name && <FieldError>{errors.name.message}</FieldError>}
                                </Field>
                                <Field orientation="vertical">
                                    <FieldLabel htmlFor="active">Status</FieldLabel>
                                    <Controller
                                        name="active"
                                        control={control}
                                        defaultValue={undefined}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value?.toString() === "true" ? "1" : field.value?.toString() === "false" ? "0" : "2"}
                                                onValueChange={(value) => {
                                                    if (value === "2") {
                                                        field.onChange(undefined);
                                                    } else {
                                                        field.onChange(value === "1");
                                                    }
                                                }}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Todos" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    <SelectItem value="2">Todos</SelectItem>
                                                    <SelectItem value="1">Ativo</SelectItem>
                                                    <SelectItem value="0">Inativo</SelectItem>
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
                                total={gateways?.total || 0}
                                page={gateways?.page || 1}
                                perPage={gateways?.limit || 10}
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
                                <TableHead>Nome</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {gateways?.docs.map((gateway: GetGateways200DocsItem) => (
                                <TableRow key={gateway.id}>
                                    <TableCell className="font-medium flex flex-row gap-2">
                                        <Button variant={"outline"} className="cursor-pointer" title="Editar" asChild>
                                            <Link to={`/gateways/edit/${gateway.id}`}><Pencil /></Link>
                                        </Button>

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant={"destructive"} className="cursor-pointer" title="Deletar">
                                                    <Trash2 />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Deletar gateway</DialogTitle>
                                                    <DialogDescription>
                                                        Tem certeza que deseja deletar este gateway?
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="outline">Cancelar</Button>
                                                    </DialogClose>
                                                    <Button variant="destructive" onClick={() => handleDeleteGateway(gateway.id)} disabled={isLoading}>Deletar</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                    <TableCell className="font-medium">{gateway.name}</TableCell>
                                    <TableCell>{gateway.active ? "Ativo" : "Inativo"}</TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </CardContent>
            </Card>
        </PrivateTemplate>
    )
}