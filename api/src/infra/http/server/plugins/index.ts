import { FastifyInstance } from "fastify";
import { registerCors } from "./cors";
import { registerStatic } from "./static";
import { registerErrorHandler } from "./errorHandler";
import { registerBullBoard } from "./bullBoard";

export async function registerPlugins(app: FastifyInstance) {
    await registerCors(app);
    registerErrorHandler(app);
    await registerBullBoard(app);
    await registerStatic(app);
}