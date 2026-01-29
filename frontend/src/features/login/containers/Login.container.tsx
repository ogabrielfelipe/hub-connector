import { useLogin } from "../hooks/useLogin";
import { LoginPresenter } from "../presenters/Login.presenter";


export function LoginContainer() {
    const { onSubmit, isLoading, errors, register } = useLogin();

    return (
        <LoginPresenter onSubmit={onSubmit} isLoading={isLoading} errors={errors} register={register} />
    )
}