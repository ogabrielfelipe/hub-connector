import { FindAllGatewayUseCase } from "@/core/application/gateway/use-case/FindAllGatewayUseCase";
import { InMemoryGatewayReposiory } from "../repositories/InMemoryGatewayReposiory";
import { gatewayFactory } from "../factories/gatewayFactory";

describe("FindAllGatewayUseCase", () => {
  let useCase: FindAllGatewayUseCase;
  let repo: InMemoryGatewayReposiory;

  beforeEach(() => {
    vi.clearAllMocks();

    repo = new InMemoryGatewayReposiory();

    useCase = new FindAllGatewayUseCase(repo);

    repo.clear();
  });

  it("should find all gateways", async () => {
    const gateway = gatewayFactory();
    await repo.save(gateway);

    const result = await useCase.execute({});

    expect(result.docs).toEqual([
      {
        id: gateway.getId(),
        name: gateway.getName(),
        active: gateway.getActive(),
      },
    ]);
  });

  it("should find all gateways with name", async () => {
    const gateway = gatewayFactory();
    await repo.save(gateway);

    const result = await useCase.execute({ name: gateway.getName() });

    expect(result.docs).toEqual([
      {
        id: gateway.getId(),
        name: gateway.getName(),
        active: gateway.getActive(),
      },
    ]);
  });

  it("should find all gateways with active", async () => {
    const gateway = gatewayFactory();
    await repo.save(gateway);

    const result = await useCase.execute({ active: gateway.getActive() });

    expect(result.docs).toEqual([
      {
        id: gateway.getId(),
        name: gateway.getName(),
        active: gateway.getActive(),
      },
    ]);
  });

  it("should find all gateways with page and limit", async () => {
    const gateway1 = gatewayFactory();
    const gateway2 = gatewayFactory();
    await repo.save(gateway1);
    await repo.save(gateway2);

    const result = await useCase.execute({ page: 1, limit: 1 });

    expect(result.docs).toEqual([
      {
        id: gateway1.getId(),
        name: gateway1.getName(),
        active: gateway1.getActive(),
      },
    ]);
    expect(result.total).toEqual(1);

    const result2 = await useCase.execute({ page: 2, limit: 1 });
    expect(result2.docs).toEqual([
      {
        id: gateway2.getId(),
        name: gateway2.getName(),
        active: gateway2.getActive(),
      },
    ]);
    expect(result2.total).toEqual(1);
  });
});
