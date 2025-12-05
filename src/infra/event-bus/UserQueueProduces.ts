import { Queue, Job } from "bullmq";
import { connection } from "../config/bullmq/bullmqConnection";
import { eventBus } from "../events/BullmqEventBus";

export interface JobData {
  userId: string;
  email: string;
}

export class UserQueueProducer {
  private readonly userQueue: Queue;

  constructor() {
    // Conexão e nome da fila
    this.userQueue = new Queue("user-events", { connection });
  }

  public async sendWelcomeEmail(data: JobData): Promise<Job | void> {
    // Adiciona um job à fila para ser processado de forma assíncrona

    console.log(data);

    return await eventBus.publish({
      type: "send-welcome-email",
      payload: {
        email: data.email,
        userId: data.userId,
      },
    });
  }
}
