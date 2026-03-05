import { FastifyInstance } from "fastify";
import { registerCors } from "./cors";
import { registerStatic } from "./static";
import registerErrorHandler from "./errorHandler";
import { registerBullBoard } from "./bullBoard";
import { registerOAuth2 } from "./oauth";

export async function registerPlugins(app: FastifyInstance) {
  await app.register(registerCors);
  await app.register(registerErrorHandler);
  await app.register(registerBullBoard);
  await app.register(registerStatic);
  await app.register(registerOAuth2);
}
