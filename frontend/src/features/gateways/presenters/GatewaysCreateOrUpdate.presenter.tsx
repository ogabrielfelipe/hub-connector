import PrivateTemplate from "@/shared/components/templates/privateTemplate";
import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import type { PostGateways201, PostGatewaysBody } from "@/shared/api/hubConnectorAPI";
import { Separator } from "@/shared/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/shared/components/ui/field";
import { Button } from "@/shared/components/ui/button";
import { AlertCircleIcon, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { SecretInput } from "./components/secret-input";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import type { GatewayCreateOrUpdateForm } from "../types";
import { Link } from "react-router-dom";


interface GatewaysCreateOrUpdatePresenterProps {
    register: UseFormRegister<GatewayCreateOrUpdateForm>;
    errors: FieldErrors<GatewayCreateOrUpdateForm>;
    isLoading: boolean;
    isEdit: boolean;
    onSubmit: React.SubmitEventHandler<PostGatewaysBody>;
    gatewayCreated: PostGateways201 | null;

    control: Control<GatewayCreateOrUpdateForm>;
}

export function GatewaysCreateOrUpdatePresenter({
    register,
    errors,
    isLoading,
    isEdit,
    onSubmit,
    gatewayCreated,
    control
}: GatewaysCreateOrUpdatePresenterProps) {
    return (
        <PrivateTemplate title={isEdit ? "Edição de Gateway" : "Criação de Gateway"} isLoading={isLoading}>
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold">{isEdit ? "Edição de Gateway" : "Criação de Gateway"}</h1>
                <p className="text-muted-foreground">{isEdit ? "Edição de um gateway existente." : "Crie um novo gateway para gerenciar e monitorar suas rotas de API. Define um nome identificável para facilitar a gestão."}</p>
            </div>

            <Separator className="my-4" />

            {isEdit ? (
                <>
                    <form onSubmit={onSubmit} className="flex flex-col gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Novo Registro</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-4">
                                    <FieldSet>
                                        <FieldLegend variant="legend" className="font-semibold">Informações do Gateway</FieldLegend>
                                        <FieldGroup>
                                            <div className="flex flex-row gap-4">
                                                <Field>
                                                    <FieldLabel htmlFor="name">Nome do Gateway</FieldLabel>
                                                    <Input id="name" autoComplete="off" placeholder="john.doe" {...register("name")} />
                                                    <FieldError>{errors.name?.message}</FieldError>
                                                </Field>
                                                <Field orientation="vertical">
                                                    <FieldLabel htmlFor="active">Ativo</FieldLabel>
                                                    <Controller
                                                        name="active"
                                                        control={control}
                                                        defaultValue={true}
                                                        render={({ field }) => (
                                                            <Select
                                                                value={field?.value?.toString()}
                                                                onValueChange={(value) => field.onChange(value === "true")}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Ativo" />
                                                                </SelectTrigger>

                                                                <SelectContent>
                                                                    <SelectItem value="true">Ativo</SelectItem>
                                                                    <SelectItem value="false">Inativo</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    />
                                                    <FieldError>{errors.active?.message}</FieldError>
                                                </Field>
                                            </div>
                                        </FieldGroup>
                                    </FieldSet>

                                    <Separator className="my-4" />

                                    <FieldSet>
                                        <FieldLegend variant="legend" className="font-semibold">Informações da xApiKey</FieldLegend>
                                        <FieldGroup>
                                            <div className="flex flex-row gap-4">
                                                <SecretInput value={gatewayCreated?.xApiKey} />
                                            </div>
                                        </FieldGroup>
                                    </FieldSet>

                                    <Separator className="my-4" />

                                    <FieldSet>
                                        <FieldLegend variant="legend" className="font-semibold">Demais informações</FieldLegend>
                                        <FieldGroup>
                                            <div className="flex flex-row gap-4">
                                                <div className="flex flex-col gap-2">
                                                    <h2 className="text-sm font-semibold text-muted-foreground">Data de Criação</h2>
                                                    <p>{new Date(gatewayCreated?.createdAt || "").toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </FieldGroup>
                                    </FieldSet>
                                </div>
                            </CardContent>
                            <CardFooter className="flex gap-2">
                                <Button variant="ghost" asChild>
                                    <Link to="/gateways">
                                        Cancelar
                                    </Link>
                                </Button>
                                <Button type="submit"><Check /> Salvar</Button>
                            </CardFooter>
                        </Card>
                    </form>

                </>
            ) : (
                <>
                    <div className="grid grid-cols-2 w-full gap-4">
                        <div className="flex flex-col gap-4">
                            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Novo Registro</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="name" className="text-sm font-medium">Nome do Gateway</label>
                                                <input type="text" id="name" {...register("name")} placeholder="Gateway" className="border border-gray-300 rounded-md p-2" />
                                                {errors.name && <FieldError>{errors.name.message}</FieldError>}
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button type="submit"><Check /> Criar Gateway</Button>
                                    </CardFooter>
                                </Card>
                            </form>

                            <Alert variant={"default"} className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
                                <AlertCircleIcon />
                                <AlertTitle>Informações Importantes</AlertTitle>
                                <AlertDescription>Após a criação, você receberá uma chave de API (xApiKey). Guarde-a em um local seguro.</AlertDescription>
                            </Alert>
                        </div>


                        {gatewayCreated ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">
                                        Informações do Gateway Criado
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div>
                                        <div className="flex flex-row gap-2">
                                            <h2 className="text-sm font-semibold text-muted-foreground">Chave de API (xApiKey):</h2>
                                        </div>
                                        <SecretInput value={gatewayCreated?.xApiKey ?? ""} />
                                    </div>
                                </CardContent>

                                <CardFooter className="flex flex-col gap-4">
                                    <Separator className="my-4" />

                                    <div className="flex flex-row gap-4 justify-evenly w-full">

                                        <div className="flex flex-col gap-2">
                                            <h2 className="text-sm font-semibold text-muted-foreground">Status</h2>
                                            <Badge variant={gatewayCreated?.active ? "default" : "destructive"}>{gatewayCreated?.active ? "Ativo" : "Inativo"}</Badge>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <h2 className="text-sm font-semibold text-muted-foreground">Data de Criação</h2>
                                            <p>{new Date(gatewayCreated?.createdAt || "").toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                        ) : (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center h-full gap-4">

                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>

                                    <article className="flex flex-col gap-2 w-full justify-center items-center">
                                        <h1 className="text-2xl font-semibold">Aguardando Criação do Gateway</h1>
                                        <p className="text-muted-foreground text-center">Insira as informações do gateway e clique em "Criar Gateway" para finalizar a criação.</p>
                                    </article>

                                </CardContent>

                            </Card>
                        )}

                    </div>
                </>
            )}


        </PrivateTemplate >
    )
}