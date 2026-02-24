import { getQueue } from "@/infra/config/bullmq/queue";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { FastifyAdapter } from "@bull-board/fastify";
import { FastifyInstance } from "fastify";

function configureBullBoard(app: FastifyInstance) {
  const serverAdapter = new FastifyAdapter();

  createBullBoard({
    queues: [new BullMQAdapter(getQueue("domain-events"))],
    serverAdapter,
  });

  serverAdapter.setBasePath("/ui");
  app.register(serverAdapter.registerPlugin(), { prefix: "/ui" });
}

export function registerBullBoard(app: FastifyInstance) {
  configureBullBoard(app);
}
