import { startWorkerProcess } from "./infra/workers";
import { startHttpServer } from "./server";


async function bootstrap() {
  const mode = process.env.PROCESS_TYPE ?? "http";

  if (mode === "http") {
    await startHttpServer();
    return;
  }

  if (mode === "worker") {
    await startWorkerProcess();
    return;
  }
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
