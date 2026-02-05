import PrivateTemplate from "@/shared/components/templates/privateTemplate";
import { Button } from "@/shared/components/ui/button";
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
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group"
import { Separator } from "@/shared/components/ui/separator";
import { Check, ChevronsLeftRight, Eye, ShieldUser } from "lucide-react";
import { Link } from "react-router-dom";


export function UsersCreateOrUpdatePresenter() {
    return (
        <PrivateTemplate>
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold">Criação de Usuário</h1>
                <p className="text-muted-foreground">Criação de um novo usuário.</p>
            </div>


            <form>
                <Card className="mt-4">
                    <CardContent>
                        <FieldSet>
                            <FieldLegend variant="legend" className="font-semibold">Informações do Usuário</FieldLegend>
                            <FieldGroup>
                                <div className="flex flex-row gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="username">Nome do Usuário</FieldLabel>
                                        <Input id="username" autoComplete="off" placeholder="john.doe" />
                                        <FieldError>Nome do usuário não pode ter espaços.</FieldError>
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="email">Email</FieldLabel>
                                        <Input id="email" autoComplete="off" aria-invalid />
                                        <FieldError>Email inválido.</FieldError>
                                    </Field>
                                </div>
                                <Field>
                                    <FieldLabel htmlFor="name">Nome Completo</FieldLabel>
                                    <Input id="name" autoComplete="off" aria-invalid />
                                    <FieldError>Nome completo inválido.</FieldError>
                                </Field>
                            </FieldGroup>
                        </FieldSet>

                        <Separator className="my-4" />

                        <FieldSet>
                            <FieldLegend variant="legend" className="font-semibold">Segurança</FieldLegend>
                            <FieldGroup className="flex flex-row gap-4">
                                <Field>
                                    <FieldLabel htmlFor="password">Senha</FieldLabel>
                                    <Input id="password" autoComplete="off" type="password" placeholder="john.doe" />
                                    <FieldError>Nome do usuário não pode ter espaços.</FieldError>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="password_confirmation">Confirmar Senha</FieldLabel>
                                    <Input id="password_confirmation" autoComplete="off" type="password" aria-invalid />
                                    <FieldError>Nome completo inválido.</FieldError>
                                </Field>
                            </FieldGroup>
                        </FieldSet>

                        <Separator className="my-4" />

                        <FieldSet className="w-full flex flex-col items-center justify-center">
                            <FieldLegend variant="legend" className="font-semibold">Nível de Acesso</FieldLegend>

                            <RadioGroup defaultValue="user" className="flex flex-row gap-4 w-full justify-center">
                                <Field
                                    className="border rounded-xl p-4 m-2 cursor-pointer  has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-2 hover:bg-muted/40 transition">
                                    <FieldLabel className="flex flex-col gap-4 cursor-pointer has-data-[state=checked]:bg-transparent" htmlFor="admin">
                                        <div className="flex justify-between items-center self-start gap-4">
                                            <RadioGroupItem
                                                value="admin"
                                                id="admin"
                                                className="mt-1 peer sr-only"
                                            />
                                            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-yellow-100 text-yellow-700 shrink-0">
                                                <ShieldUser className="w-6 h-6" />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <h2 className="font-semibold text-base">Administrador</h2>

                                            <p className="text-sm text-muted-foreground leading-snug w-56">
                                                Acesso total a todas as configurações e gestão de usuários.
                                            </p>
                                        </div>


                                    </FieldLabel>
                                </Field>

                                <Field
                                    className="border rounded-xl p-4 m-2 cursor-pointer  has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-2 hover:bg-muted/40 transition">
                                    <FieldLabel className="flex flex-col gap-4 cursor-pointer has-data-[state=checked]:bg-transparent" htmlFor="user">
                                        <div className="flex justify-between items-center self-start gap-4">
                                            <RadioGroupItem
                                                value="user"
                                                id="user"
                                                className="mt-1 peer sr-only"
                                            />
                                            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-yellow-100 text-yellow-700 shrink-0">
                                                <Eye className="w-6 h-6" />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <h2 className="font-semibold text-base">Usuário</h2>

                                            <p className="text-sm text-muted-foreground leading-snug w-56">
                                                Acesso apenas para leitura de logs e dashboards.
                                            </p>
                                        </div>


                                    </FieldLabel>
                                </Field>
                                <Field
                                    className="border rounded-xl p-4 m-2 cursor-pointer  has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-2 hover:bg-muted/40 transition">
                                    <FieldLabel className="flex flex-col gap-4 cursor-pointer has-data-[state=checked]:bg-transparent" htmlFor="dev">
                                        <div className="flex justify-between items-center self-start gap-4">
                                            <RadioGroupItem
                                                value="dev"
                                                id="dev"
                                                className="mt-1 peer sr-only"
                                            />
                                            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-yellow-100 text-yellow-700 shrink-0">
                                                <ChevronsLeftRight className="w-6 h-6" />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <h2 className="font-semibold text-base">Desenvolvedor</h2>

                                            <p className="text-sm text-muted-foreground leading-snug w-56">
                                                Gerencia rotas de APIs, logs e chaves de acesso.
                                            </p>
                                        </div>


                                    </FieldLabel>
                                </Field>
                            </RadioGroup>
                        </FieldSet>
                    </CardContent>
                    <CardFooter className="flex  gap-4 justify-end">
                        <Button variant="ghost" asChild>
                            <Link to="/users">
                                Cancelar
                            </Link>
                        </Button>
                        <Button variant="default"><Check className="w-4 h-4" /> Criar Usuário</Button>
                    </CardFooter>
                </Card>
            </form>


        </PrivateTemplate >
    )
}