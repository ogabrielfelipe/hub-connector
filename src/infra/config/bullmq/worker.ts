import { Worker } from "bullmq";

type WorkerFactory = () => Worker;

const workerFactories: WorkerFactory[] = [];

export function registerWorker(factory: WorkerFactory) {
  workerFactories.push(factory);
}

export function startWorkers() {
  workerFactories.forEach((factory) => {
    const worker = factory();

    console.log(`Worker for queue "${worker.name}" started.`);

    worker.on("completed", (job) => {
      console.log(`Job completed: ${job.id} in queue ${job.queueName}`);
    });

    worker.on("failed", (job, err) => {
      console.error(
        { jobId: job?.id, queue: job?.queueName, err },
        "Job failed",
      );
    });
  });
}
