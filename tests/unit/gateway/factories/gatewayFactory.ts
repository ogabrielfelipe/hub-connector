import { Gateway } from "@/core/domain/gateway/entities/Gateway";
import { faker } from "@faker-js/faker";

type GatewayFactoryRoutes = {
    id: string;
    path: string;
    destination: string;
}

interface GatewayFactoryProps {
    name?: string;
    id?: string;
    active?: boolean;
    routes?: GatewayFactoryRoutes[];
    createdAt?: Date;
    updatedAt?: Date;
}

export function gatewayFactory(props: GatewayFactoryProps = {}): Gateway {

    const routes = props.routes?.map(route => ({
        id: faker.string.uuid(),
        path: route.path,
        destination: route.destination
    })) ?? [];

    return Gateway.createNew(
        props.name ?? faker.string.alpha(),
        props.id ?? faker.string.uuid(),
        props.active ?? true,
        props.createdAt ?? new Date(),
        props.updatedAt ?? new Date(),
        routes,
    )
}