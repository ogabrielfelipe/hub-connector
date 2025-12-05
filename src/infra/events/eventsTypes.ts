export interface UserCreatedEvent {
  type: "send-welcome-email";
  payload: {
    userId: string;
    email: string;
  };
}

export type DomainEvent = UserCreatedEvent;
