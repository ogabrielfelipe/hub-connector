import type { FastifyInstance } from "fastify";
import { OpenSearchRoutingExecutionsSearchRepository } from "@/infra/search/opensearch/OpenSearchRoutingExecutionsSearchRepository";
import { MongoRoutingRepository } from "@/infra/database/repositories/MongoRoutingRepository";
import { ReportController } from "../controllers/ReportController";
import { MongoGatewayRepository } from "@/infra/database/repositories/MongoGatewayRepository";
import { authMiddleware } from "../middlewares/authMiddleware";
import { dashReportResponseSchema } from "../schemas/reportSchemas";

export async function reportRoutes(app: FastifyInstance) {
  const searchRepository = new OpenSearchRoutingExecutionsSearchRepository();
  const gatewayRepository = new MongoGatewayRepository();
  const routingRepository = new MongoRoutingRepository(gatewayRepository);

  const reportController = new ReportController(
    searchRepository,
    routingRepository,
  );

  app.get(
    "/dashboard",
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ["Report"],
        summary: "Get dashboard report",
        description: "Endpoint to get the dashboard report.",
        response: {
          200: dashReportResponseSchema,
        },
      },
    },
    (req, reply) => reportController.handle(req, reply),
  );
}
