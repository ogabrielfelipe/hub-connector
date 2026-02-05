import type { GetUsersParams, GetUsersRole } from "@/shared/api/hubConnectorAPI";

export type UserFormValues = Omit<GetUsersParams, 'role'> & {
    role?: GetUsersRole | 'all';
};
