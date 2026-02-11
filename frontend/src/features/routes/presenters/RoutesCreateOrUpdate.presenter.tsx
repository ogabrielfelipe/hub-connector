import PrivateTemplate from "@/shared/components/templates/privateTemplate";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea"
import { Card, CardContent, CardFooter } from "@/shared/components/ui/card";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input";
import { Separator } from "@/shared/components/ui/separator";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Controller, FormProvider, type UseFormReturn } from "react-hook-form";
import type { GetGateways200, GetGateways200DocsItem } from "@/shared/api/hubConnectorAPI";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { HeadersField } from "./components/headers-field";
import type { RouteFormValues } from "../types";
import { slugify } from "@/shared/lib/utils";

interface Props {
    onSubmit: React.SubmitEventHandler<HTMLFormElement>;
    isEdit: boolean;
    isLoading: boolean;
    gateways: GetGateways200 | null;
    methodsForm: UseFormReturn<RouteFormValues>;
}

export function RoutesCreateOrUpdatePresenter({ isEdit, onSubmit, isLoading, gateways, methodsForm }: Props) {
    return (
        <PrivateTemplate title={isEdit ? "Edição de Rota" : "Criação de Rota"} isLoading={isLoading}>
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold">{isEdit ? "Edição de Rota" : "Criação de Rota"}</h1>
                <p className="text-muted-foreground">{isEdit ? "Edição de uma rota existente." : "Criação de uma nova rota."}</p>
            </div>

            <FormProvider {...methodsForm} >

                <form onSubmit={onSubmit}>
                    <Card className="mt-4">
                        <CardContent>
                            <FieldSet>
                                <FieldLegend variant="legend" className="font-semibold">Informações da Rota</FieldLegend>
                                <FieldGroup>
                                    <div className="flex flex-row gap-4">
                                        <Field>
                                            <FieldLabel htmlFor="name">Nome da Rota</FieldLabel>
                                            <Input id="name" autoComplete="off" placeholder="Lista Usuários" {...methodsForm.register("name")} />
                                            <FieldError>{methodsForm.formState.errors.name?.message}</FieldError>
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="slug">Slug</FieldLabel>
                                            <Input id="slug" autoComplete="off" placeholder="lista-usuarios" aria-invalid {...methodsForm.register("slug", {
                                                onChange: (e) => {
                                                    const formatted = slugify(e.target.value)
                                                    methodsForm.setValue("slug", formatted)
                                                },
                                            })} />
                                            <FieldError>{methodsForm.formState.errors.slug?.message}</FieldError>
                                        </Field>
                                    </div>
                                    <Field>
                                        <FieldLabel htmlFor="description">Descrição</FieldLabel>
                                        <Textarea id="description" autoComplete="off" placeholder="Lista usuários" aria-invalid {...methodsForm.register("description")} />
                                        <FieldError>{methodsForm.formState.errors.description?.message}</FieldError>
                                    </Field>


                                    <Field orientation="vertical">
                                        <FieldLabel htmlFor="gatewayId">Gateway</FieldLabel>
                                        <Controller
                                            name="gatewayId"
                                            control={methodsForm.control}
                                            render={({ field }) => (
                                                <Select
                                                    value={field.value || ""}
                                                    onValueChange={(value) => {
                                                        if (value) {
                                                            field.onChange(value)
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Selecione o gateway" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {gateways?.docs?.map((gateway: GetGateways200DocsItem) => (
                                                            <SelectItem key={gateway.id} value={gateway.id}>
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

                            <Separator className="my-4" />

                            <FieldSet>
                                <FieldLegend variant="legend" className="font-semibold">Configuração do Endpoint</FieldLegend>
                                <FieldGroup className="flex flex-col gap-4">
                                    <div className="flex flex-row gap-4">

                                        <Field orientation="vertical">
                                            <FieldLabel htmlFor="method">Método</FieldLabel>
                                            <Controller
                                                name="method"
                                                control={methodsForm.control}
                                                defaultValue={"POST"}
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value?.toString()}
                                                        onValueChange={(value) => {
                                                            field.onChange(value);
                                                        }}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Selecione o método" />
                                                        </SelectTrigger>

                                                        <SelectContent>
                                                            {["GET", "POST", "PUT", "DELETE", "PATCH"].map((method) => (
                                                                <SelectItem key={method} value={method}>
                                                                    {method}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="url">URL</FieldLabel>
                                            <Input id="url" autoComplete="off" type="url" placeholder="https://example.com" {...methodsForm.register("url")} />
                                            <FieldError>{methodsForm.formState.errors.url?.message}</FieldError>
                                        </Field>

                                    </div>
                                    <HeadersField />
                                </FieldGroup>
                            </FieldSet>


                        </CardContent>
                        <CardFooter className="flex  gap-4 justify-end">
                            <Button variant="ghost" asChild>
                                <Link to="/routes">
                                    Cancelar
                                </Link>
                            </Button>
                            <Button variant="default"><Check className="w-4 h-4" /> Criar Rota</Button>
                        </CardFooter>
                    </Card>
                </form>
            </FormProvider>


        </PrivateTemplate >
    )
}