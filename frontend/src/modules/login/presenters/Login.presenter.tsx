import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { type FieldErrors, type UseFormRegister } from "react-hook-form";
import type { FormLoginSchema } from "../types";
import { Button } from "@/components/ui/button";


type LoginPresenterProps = {
    onSubmit: React.FormEventHandler<HTMLFormElement>;
    isLoading: boolean
    errors: FieldErrors<FormLoginSchema> | string;
    register: UseFormRegister<FormLoginSchema>
}

export function LoginPresenter({ onSubmit, isLoading, errors, register }: LoginPresenterProps): React.JSX.Element {

    return (
        <div className="bg-muted">
            <div className="flex flex-col max-w-[400px] gap-5 mx-auto h-screen items-center justify-center">

                <h1 className="text-2xl font-bold text-center">Hub Connector</h1>

                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onSubmit} className="flex flex-col gap-5">
                            <div>
                                <Label htmlFor="username" >Nome de Usuário: </Label>
                                <Input type="text" id="username" {...register("username", { required: true })} />
                                {typeof errors === 'object' && errors?.username && (
                                    <p className="text-red-500 text-sm">{errors?.username.message}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="password" >Senha: </Label>
                                <Input type="password" id="password" {...register("password", { required: true })} />
                                {typeof errors === 'object' && errors?.password && (
                                    <p className="text-red-500 text-sm">{errors?.password.message}</p>
                                )}
                            </div>

                            <Button type="submit" variant="default" disabled={isLoading}>
                                {isLoading ? 'Carregando...' : 'Login'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}


/**
 * <div>
            <h1>Login</h1>
            <form method="POST" onSubmit={(e: React.FormEvent<HTMLFormElement>) => onSubmit(e.currentTarget.email.value, e.currentTarget.password.value)}>
                <label htmlFor="email">Email: </label>
                <input type="email" name="email" />
                <label htmlFor="password">Senha: </label>
                <input type="password" name="password" />
                <button type="submit">
                    {isLoading ? 'Carregando...' : 'Login'}
                </button>
            </form>
        </div>
 */