import { CacheRepository } from "@/core/application/ports/CacheRepository";
import { FastifyReply, FastifyRequest } from "fastify";
import { delPrefixCacheSchema } from "../schemas/configSchema";
import { RedisCacheRepository } from "@/infra/cache/redis/RedisCacheRepository";


export class ConfigController {
    private cacheRepository: CacheRepository;

    constructor(redisCacheRepository: RedisCacheRepository) {
        this.cacheRepository = redisCacheRepository;
    }


    async delPrefixCache(req: FastifyRequest, reply: FastifyReply) {
        const { prefix } = delPrefixCacheSchema.parse(req.params);
        await this.cacheRepository.delByPrefix(prefix);
        return reply.status(204).send();
    }
}