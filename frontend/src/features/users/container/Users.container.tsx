import { useUser } from "../hooks/useUser";
import { UsersPresenter } from "../presenter/Users.presenter";



export function UsersContainer() {
    const { users, onSubmitFilter, handleDeleteUser, control, register, errors } = useUser()

    return (
        <UsersPresenter users={users} onSubmitFilter={onSubmitFilter} handleDeleteUser={handleDeleteUser} control={control} register={register} errors={errors} />
    )
}