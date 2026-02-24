import { FastifyInstance } from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";

function configureStatic(app: FastifyInstance) {
  app.register(fastifyStatic, {
    root: path.join(process.cwd(), "public-docs"),
    prefix: "/docs/",
  });
}

export function registerStatic(app: FastifyInstance) {
  configureStatic(app);
}
