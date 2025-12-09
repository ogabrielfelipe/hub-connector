import { OnRoutingExecutionCreatedHandler } from "../handlers/OnRoutingExecutionCreatedHandler";

const handlers = {
    RoutingExecutionCreated: new OnRoutingExecutionCreatedHandler(),
};

export async function handleDomainEvent(eventName: keyof typeof handlers, payload: unknown) {
    const handler = handlers[eventName];
    if (!handler) return;

    await handler.handle(payload);
}