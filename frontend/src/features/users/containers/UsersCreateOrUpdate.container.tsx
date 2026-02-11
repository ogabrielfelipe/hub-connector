import { useParams } from "react-router-dom";
import { UsersCreateOrUpdatePresenter } from "../presenters/UsersCreateOrUpdate.presenter";
import { useUserCreateOrUpdate } from "../hooks/useUserCreateOrUpdate";



export function UsersCreateOrUpdateContainer() {
    const { id } = useParams<{ id: string }>()
    const { register, control, onSubmit, errors, isLoading } = useUserCreateOrUpdate({ userId: id })

    const isEdit = Boolean(id)

    return (
        <UsersCreateOrUpdatePresenter register={register} control={control} isEdit={isEdit} onSubmit={onSubmit} errors={errors} isLoading={isLoading} />
    )
}