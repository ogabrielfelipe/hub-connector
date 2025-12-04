import { CaslAbilityFactory } from "@/core/application/security/casl.factory";
import { MongoGatewayRepository } from "@/infra/database/mongo/repositories/MongoGatewayRepository";
import { MongoUserRepository } from "@/infra/database/mongo/repositories/MongoUserRepository";
import { WinstonLoggerService } from "@/infra/logger/winston-logger.service";
import { FastifyInstance } from "fastify";
import { GatewayController } from "../controllers/GatewayController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { CreateGatewayResponseSchema, CreateGatewaySchema, DeleteGatewaySchema, FindAllGatewayResponseSchema, FindAllGatewaySchema, FindOneGatewaySchema, UpdateGatewayParamsSchema, UpdateGatewayResponseSchema, UpdateGatewaySchema } from "../schemas/gatewaySchemas";



export async function gatewayRoutes(app: FastifyInstance) {
    const gatewayRepository = new MongoGatewayRepository();
    const userRepository = new MongoUserRepository();
    const logger = new WinstonLoggerService();
    const caslFactory = new CaslAbilityFactory();

    const gatewayController = new GatewayController(gatewayRepository, userRepository, caslFactory, logger);


    app.post(
        "/",
        {
            preHandler: [authMiddleware],
            schema: {
                body: CreateGatewaySchema,
                response: { 201: CreateGatewayResponseSchema },
                tags: ["Gateways"],
                summary: "Create a new gateway",
                description: "Endpoint to create a new gateway in the system.",
            },
        },
        (req, reply) => gatewayController.createGateway(req, reply),
    );


    app.put("/:gatewayId", {
        preHandler: [authMiddleware],
        schema: {
            params: UpdateGatewayParamsSchema,
            body: UpdateGatewaySchema,
            response: { 200: UpdateGatewayResponseSchema },
            tags: ["Gateways"],
            summary: "Update an existing gateway",
            description: "Endpoint to update an existing gateway in the system.",
        },
    }, (req, reply) => gatewayController.updateGateway(req, reply));

    app.delete("/:gatewayId", {
        preHandler: [authMiddleware],
        schema: {
            params: DeleteGatewaySchema,
            response: { 200: {} },
            tags: ["Gateways"],
            summary: "Delete an existing gateway",
            description: "Endpoint to delete an existing gateway in the system.",
        },
    }, (req, reply) => gatewayController.deleteGateway(req, reply));

    app.get("/", {
        preHandler: [authMiddleware],
        schema: {
            querystring: FindAllGatewaySchema,
            response: { 200: FindAllGatewayResponseSchema },
            tags: ["Gateways"],
            summary: "Find all gateways",
            description: "Endpoint to find all gateways in the system.",
        },
    }, (req, reply) => gatewayController.findAllGateway(req, reply));

    app.get("/:gatewayId", {
        preHandler: [authMiddleware],
        schema: {
            params: FindOneGatewaySchema,
            response: { 200: UpdateGatewayResponseSchema },
            tags: ["Gateways"],
            summary: "Find a gateway by id",
            description: "Endpoint to find a gateway by id in the system.",
        },
    }, (req, reply) => gatewayController.findOneGateway(req, reply));
}