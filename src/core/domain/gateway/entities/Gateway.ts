import { v4 as uuidv4 } from 'uuid';

export type GatewayRoutes = {
    id: string;
    path: string;
    destination: string;
}

export class Gateway {
    private id: string;
    private name: string;
    private xApiKey: string;
    private routes?: GatewayRoutes[];
    private active: boolean;
    private createdAt: Date;
    private updatedAt: Date;


    private constructor(id: string, name: string, xApiKey: string, active: boolean, createdAt: Date, updatedAt: Date, routes?: GatewayRoutes[]) {
        this.id = id;
        this.name = name;
        this.xApiKey = xApiKey;
        this.routes = routes;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static createNew(name: string, xApiKey: string, active: boolean, createdAt: Date, updatedAt: Date, routes?: GatewayRoutes[]) {
        const newId = uuidv4();
        return new Gateway(newId, name, xApiKey, active, createdAt, updatedAt, routes);
    }

    public static fromPersistence(id: string, name: string, xApiKey: string, active: boolean, createdAt: Date, updatedAt: Date, routes?: GatewayRoutes[]) {
        return new Gateway(
            id,
            name,
            xApiKey,
            active,
            createdAt,
            updatedAt,
            routes,
        );
    }

    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getXApiKey(): string {
        return this.xApiKey;
    }

    public getRoutes(): GatewayRoutes[] | undefined {
        return this.routes;
    }

    public getActive(): boolean {
        return this.active;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public getUpdatedAt(): Date {
        return this.updatedAt;
    }

    public updateName(newName: string): void {
        this.name = newName;
    }
    public updateRoutes(newRoutes: GatewayRoutes[] | undefined): void {
        this.routes = newRoutes;
    }
    public updateActive(newActive: boolean): void {
        this.active = newActive;
    }
    public updateUpdatedAt(newUpdatedAt: Date): void {
        this.updatedAt = newUpdatedAt;
    }
}