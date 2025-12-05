/* eslint-disable @typescript-eslint/no-explicit-any */
import { IEventBus } from "@/core/application/IEventBus";
import { UserQueueProducer } from "./UserQueueProduces";

export class BullEventBus implements IEventBus {
  constructor(private readonly producer: UserQueueProducer) {}

  async publish(event: object): Promise<void> {
    if (event.constructor.name === "UserCreatedEvent") {
      await this.producer.sendWelcomeEmail({
        userId: (event as any).userId,
        email: (event as any).email,
      });
    }
  }
}
