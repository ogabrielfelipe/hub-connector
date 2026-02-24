import { connectMongo } from "../config/mongoConnection";
import { runMigrations } from "../database/migrations";

export async function bootstrapDatabase() {
    await connectMongo();

    if (process.env.NODE_ENV !== "production") {
        await runMigrations();
    }
}