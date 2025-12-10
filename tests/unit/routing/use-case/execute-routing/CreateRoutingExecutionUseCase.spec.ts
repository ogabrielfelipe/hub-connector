vi.mock("@/shared/infra/events/event-queue", () => ({
  domainEventBus: {
    publish: vi.fn(),
  },
}));
import { CreateRoutingExecutionUseCase } from "@/core/application/routing/use-case/execute-route/CreateRoutingExecutionUseCase";
import { InMemoryRoutingRepository } from "../../repositories/InMemoryRoutingRepository";
import { InMemoryGatewayReposiory } from "../../../gateway/repositories/InMemoryGatewayReposiory";
import { gatewayFactory } from "../../../gateway/factories/gatewayFactory";
import { routingFactory } from "../../factories/routingFactory";
import { InMemoryRoutingExecutionRepository } from "../../repositories/InMemoryRoutingExecutionRepository";

import { domainEventBus } from "@/infra/events/event-queue";

describe("CreateRoutingExecutionUseCase", () => {
  let useCase: CreateRoutingExecutionUseCase;
  let repoRouting: InMemoryRoutingRepository;
  let repoRoutingExecution: InMemoryRoutingExecutionRepository;
  let gatewayRepo: InMemoryGatewayReposiory;

  beforeEach(() => {
    vi.clearAllMocks();

    gatewayRepo = new InMemoryGatewayReposiory();
    repoRouting = new InMemoryRoutingRepository(gatewayRepo);
    repoRoutingExecution = new InMemoryRoutingExecutionRepository();

    useCase = new CreateRoutingExecutionUseCase(
      repoRoutingExecution,
      repoRouting,
    );

    repoRouting.clear();
    repoRoutingExecution.clear();
  });

  it("should create a new routing execution", async () => {
    const gateway = gatewayFactory({});
    gatewayRepo.save(gateway);

    const routing = routingFactory({ gatewayId: gateway.getId() });
    repoRouting.save(routing);

    const routingExecution = await useCase.execute({
      routingSlug: routing.getSlug(),
      payload: { message: "Hello World" },
    });

    expect(routingExecution).toBeDefined();
    expect(domainEventBus.publish).toHaveBeenCalled();
  });
});
