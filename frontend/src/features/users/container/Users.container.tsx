import { useUser } from "../hooks/useUser";
import { UsersPresenter } from "../presenter/Users.presenter";



export function UsersContainer() {
    const { users, onSubmitFilter, handleDeleteUser, control, register, errors, handlePageChange, handlePerPageChange, isLoading } = useUser()

    return (
        <UsersPresenter
            users={users}
            onSubmitFilter={onSubmitFilter}
            handleDeleteUser={handleDeleteUser}
            control={control}
            register={register}
            errors={errors}
            onChangePage={handlePageChange}
            onChangePerPage={handlePerPageChange}
            isLoading={isLoading}
        />
    )
}