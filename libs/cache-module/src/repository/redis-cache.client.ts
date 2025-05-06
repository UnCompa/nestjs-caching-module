import Redis, { RedisOptions } from 'ioredis';
import { CacheClient } from './cache.repository';

export class RedisCacheClient implements CacheClient {
  private client: Redis;

  constructor(options?: RedisOptions) {
    this.client = options ? new Redis(options) : new Redis();
  }

  async get<T>(key: string): Promise<T | undefined> {
    const val = await this.client.get(key);
    if (val === null) return undefined;
    try {
      return JSON.parse(val) as T;
    } catch {
      return undefined;
    }
  }

  async set<T>(key: string, val: T, ttlSeconds?: number): Promise<void> {
    const str = JSON.stringify(val);
    if (ttlSeconds) {
      await this.client.set(key, str, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, str);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
} 