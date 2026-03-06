import { useLogin } from "../hooks/useLogin";
import { LoginPresenter } from "../presenters/Login.presenter";
import { useSearchParams } from "react-router-dom";



export function LoginContainer() {
    const [searchParams] = useSearchParams()
    const code = searchParams.get("code") as string
    const state = searchParams.get("state") as string

    const { onSubmit, isLoading, errors, register, LoginWithGitHub } = useLogin({ code, state });

    return (
        <LoginPresenter onSubmit={onSubmit} isLoading={isLoading} errors={errors} register={register} LoginWithGitHub={LoginWithGitHub} />
    )
}