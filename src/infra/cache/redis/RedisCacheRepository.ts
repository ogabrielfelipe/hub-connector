import { CacheRepository } from "@/core/application/ports/CacheRepository";
import { redis } from "./redisconnection";

export class RedisCacheRepository implements CacheRepository {
    private readonly ttlSecondsFix: number = 60 * 60; // 1 hour

    async get<T>(key: string): Promise<T | null> {
        const data = await redis.get(key);
        if (!data) return null;
        return JSON.parse(data) as T;
    }

    async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
        await redis.set(key, JSON.stringify(value), "EX", ttlSeconds || this.ttlSecondsFix);
    }

    async del(key: string): Promise<void> {
        await redis.del(key);
    }

    async delByPrefix(prefix: string): Promise<void> {
        const stream = redis.scanStream({ match: `${prefix}:*` });

        const keys: string[] = [];
        for await (const key of stream) {
            keys.push(key);
        }
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    }
}