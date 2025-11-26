import { connectMongo } from "../config/mongoConnection";
import { startWorkers } from "../config/bullmq/worker";
import "./sendWelcomeEmail";


export async function startWorkerProcess() {
    await connectMongo();
    startWorkers();
}