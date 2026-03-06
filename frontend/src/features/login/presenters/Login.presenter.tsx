import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import React from "react";
import { type UseFormRegister } from "react-hook-form";
import { isErrorLogin, isFieldErrors, type ErrorLogin, type FormLoginSchema } from "../types";
import { Button } from "@/shared/components/ui/button";

import logo from "@/assets/logo_v1.png"

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/shared/components/ui/alert"

import GitHubLogo from "@/assets/GitHub_Invertocat_Black.svg"

type LoginPresenterProps = {
    onSubmit: React.FormEventHandler<HTMLFormElement>;
    isLoading: boolean
    errors: ErrorLogin;
    register: UseFormRegister<FormLoginSchema>
    LoginWithGitHub: () => Promise<void>
}

export function LoginPresenter({ onSubmit, isLoading, errors, register, LoginWithGitHub }: LoginPresenterProps): React.JSX.Element {
    return (
        <div className="bg-muted">
            <div className="flex min-h-screen items-center justify-center p-4">
                <Card className="w-full max-w-7xl py-0">
                    <CardContent className="grid grid-cols-2 px-0">
                        <div className="w-full h-full overflow-hidden">
                            <img src={logo} className="object-cover block w-2xl h-[500px]" alt="Hub Connector" />
                        </div>

                        <div className="flex flex-col gap-5 w-full h-full  p-5">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-2xl font-bold">Acesso ao Sistema</h1>
                                <p className="text-muted-foreground">Gerencie e monitore suas transações de API de forma centralizada e segura.</p>
                            </div>

                            {isErrorLogin(errors) && errors?.code === 'INVALID_CREDENTIALS' && (
                                <Alert variant="destructive" className="w-full border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
                                    <AlertTitle className="font-semibold">Erro ao realizar Login</AlertTitle>
                                    <AlertDescription className="font-medium">
                                        {errors?.message}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <form onSubmit={onSubmit} className="flex flex-col gap-5 p-5">
                                <div>
                                    <Label htmlFor="username" >Nome de Usuário: </Label>
                                    <Input type="text" id="username" {...register("username", { required: true })} />
                                    {isFieldErrors(errors) && errors?.username && (
                                        <p className="text-red-500 text-sm">{errors?.username.message}</p>
                                    )}
                                </div>
                                <div>

                                    <Label htmlFor="password" >Senha: </Label>
                                    <Input type="password" id="password" {...register("password", { required: true })} />
                                    {isFieldErrors(errors) && errors?.password && (
                                        <p className="text-red-500 text-sm">{errors?.password.message}</p>
                                    )}
                                    <div className="flex justify-end mt-2">
                                        <a href="#" className="text-sm text-primary hover:underline">Esqueci minha senha</a>
                                    </div>

                                </div>

                                <Button type="submit" variant="default" disabled={isLoading}>
                                    {isLoading ? 'Carregando...' : 'Entrar '}
                                </Button>

                            </form>


                            <div className="flex justify-center mt-2">
                                <Button variant="outline" type="button" onClick={() => LoginWithGitHub()}>
                                    <img src={GitHubLogo} alt="GitHub Logo" className="w-5 h-5" />
                                    Login com GitHub</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div >
    )
}
