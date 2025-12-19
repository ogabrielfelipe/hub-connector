export interface IEventBus {
  publish(event: object): Promise<void>;
}
