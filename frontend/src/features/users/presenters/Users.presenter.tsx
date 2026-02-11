import PrivateTemplate from "@/shared/components/templates/privateTemplate";
import { Button } from "@/shared/components/ui/button";
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
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/shared/components/ui/field"
import { Ellipsis, Filter, Pencil, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { DataPagination } from "@/shared/components/data-pagination";
import type { GetUsers200, GetUsers200DocsItem } from "@/shared/api/hubConnectorAPI";
import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import type { UserFormValues } from "../types";

interface Props {
    users: GetUsers200 | null,
    onSubmitFilter: React.SubmitEventHandler<HTMLFormElement>,
    handleDeleteUser: (id: string) => void,
    register: UseFormRegister<UserFormValues>,
    onChangePage: (page: number) => void,
    onChangePerPage: (perPage: number) => void,
    errors: FieldErrors<UserFormValues>,
    control: Control<UserFormValues>,
    isLoading: boolean,
}

export function UsersPresenter({ users, onSubmitFilter, handleDeleteUser, register, control, onChangePage, onChangePerPage, isLoading }: Props): React.JSX.Element {
    return (
        <PrivateTemplate isLoading={isLoading} title="Gestão de Acessos">
            <div className="flex flex-row justify-between items-center gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold">Gestão de Acessos</h1>
                    <p className="text-muted-foreground">Gerenciamento de usuários e acessos.</p>
                </div>

                <Button variant="default" asChild>
                    <Link to="/users/new">
                        <Plus />
                        Novo Usuário
                    </Link>
                </Button>
            </div>


            {/**
             * Filters
             */}
            <Card className="mt-4">
                <CardContent>
                    <form onSubmit={onSubmitFilter}>
                        <FieldSet className="mb-4">
                            <FieldLegend className="text-lg font-semibold">Filtros</FieldLegend>
                            <FieldGroup className="flex flex-row gap-4 w-full items-center">
                                <Field orientation="vertical">
                                    <FieldLabel htmlFor="username">Nome de Usuário</FieldLabel>
                                    <Input id="username" autoComplete="off" type="text" placeholder="john.doe" {...register("username")} />
                                </Field>
                                <Field orientation="vertical">
                                    <FieldLabel htmlFor="name">Nome</FieldLabel>
                                    <Input id="name" autoComplete="off" type="text" placeholder="John Doe" {...register("name")} />
                                </Field>
                                <Field orientation="vertical">
                                    <FieldLabel htmlFor="role">Perfil</FieldLabel>
                                    <Controller
                                        name="role"
                                        control={control}
                                        defaultValue="all"
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Todos" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    <SelectItem value="admin">Administrador</SelectItem>
                                                    <SelectItem value="user">Usuário</SelectItem>
                                                    <SelectItem value="developer">Desenvolvedor</SelectItem>
                                                    <SelectItem value="all">Todos</SelectItem>
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
                                total={users?.total || 0}
                                page={users?.page || 1}
                                perPage={users?.limit || 10}
                                onPageChange={(page) => {
                                    onChangePage(page)
                                }}
                                onPerPageChange={(perPage) => {
                                    onChangePerPage(perPage)
                                }}
                            />
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-right"><Ellipsis className="w-4 h-4" /></TableHead>
                                <TableHead>Nome de Usuário</TableHead>
                                <TableHead>Nome</TableHead>
                                <TableHead>Perfil</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users?.docs.map((user: GetUsers200DocsItem) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium flex flex-row gap-2">
                                        <Button variant={"outline"} className="cursor-pointer" title="Editar" asChild>
                                            <Link to={`/users/edit/${user.id}`}><Pencil /></Link>
                                        </Button>

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant={"destructive"} className="cursor-pointer" title="Deletar">
                                                    <Trash2 />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Deletar usuário</DialogTitle>
                                                    <DialogDescription>
                                                        Tem certeza que deseja deletar este usuário?
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="outline">Cancelar</Button>
                                                    </DialogClose>
                                                    <Button variant="destructive" onClick={() => handleDeleteUser(user.id)} disabled={isLoading}>Deletar</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                    <TableCell className="font-medium">{user.username}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>{user.active ? "Ativo" : "Inativo"}</TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </CardContent>
            </Card>


        </PrivateTemplate >

    )
}