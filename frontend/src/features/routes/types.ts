import type { PostRoutingsBody } from "@/shared/api/hubConnectorAPI";


export type HeaderItem = {
    key: string
    value: string
}

export type RouteFormValues = Omit<PostRoutingsBody, 'headers'> & {
    headers?: HeaderItem[];
};
