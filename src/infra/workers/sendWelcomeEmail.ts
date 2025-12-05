import { Worker } from "bullmq";
import { registerWorker } from "../config/bullmq/worker";
import { connection } from "../config/bullmq/bullmqConnection";

registerWorker(() => {
  return new Worker(
    "user-events",
    async (job) => {
      const { userId, email } = job.data.payload;

      console.log(
        `ID: ${job.id} - Name: ${job.name}. Sending welcome email to user ${userId} at ${email}`,
      );
    },

    { connection },
  );
});
