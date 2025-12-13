import { up as createRoutingIndexes } from "./create-routing-indexes";
import { up as createUserIndexes } from "./create-user-indexes";
import { up as createRoutingExecutionsIndexes } from "./create-routing-executions-indexes";
import { up as createGatewayIndexes } from "./create-gateway-indexes";

export async function runMigrations() {
    console.log("Running migrations...");

    await createRoutingIndexes();
    await createUserIndexes();
    await createRoutingExecutionsIndexes();
    await createGatewayIndexes();

    console.log("Migrations completed");
}