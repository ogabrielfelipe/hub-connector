import IORedis from "ioredis";
import { redisConfig } from "../config/redis";

export class RedisClient {
  private static instance: IORedis;

  static get() {
    if (!this.instance) {
      this.instance = new IORedis(redisConfig);
    }
    return this.instance;
  }

  static async disconnect() {
    if (this.instance) {
      await this.instance.quit();
    }
  }
}
