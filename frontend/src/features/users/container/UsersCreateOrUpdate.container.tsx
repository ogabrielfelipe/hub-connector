import { useParams } from "react-router-dom";
import { UsersCreateOrUpdatePresenter } from "../presenter/UsersCreateOrUpdate.presenter";



export function UsersCreateOrUpdateContainer() {
    const { id } = useParams<{ id: string }>()

    const isEdit = Boolean(id)

    console.log(isEdit)
    console.log(id)

    return (
        <UsersCreateOrUpdatePresenter />
    )
}