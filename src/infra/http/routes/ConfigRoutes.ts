import { FastifyInstance } from "fastify";
import { ConfigController } from "../controllers/ConfigController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { delPrefixCacheResponseSchema, delPrefixCacheSchema } from "../schemas/configSchema";
import { RedisCacheRepository } from "@/infra/cache/redis/RedisCacheRepository";



export async function configRoutes(app: FastifyInstance) {
    const redisCacheRepository = new RedisCacheRepository();
    const configController = new ConfigController(redisCacheRepository);

    app.delete(
        "/del-prefix-cache/:prefix",
        {
            preHandler: [authMiddleware],
            schema: {
                params: delPrefixCacheSchema,
                response: { 204: delPrefixCacheResponseSchema },
                tags: ["Config"],
                summary: "Delete all keys by prefix",
                description: "Endpoint to delete all keys by prefix in the system.",
            },
        },
        (req, reply) => configController.delPrefixCache(req, reply),
    );
}
