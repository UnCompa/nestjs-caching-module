import { Logger } from '@nestjs/common';
import { LRUCache } from 'lru-cache';
import { CacheClient } from './cache.repository';

export class MemoryCacheClient implements CacheClient {
  private cache: LRUCache<string, any>;
  private readonly logger = new Logger(MemoryCacheClient.name);
  private readonly enableLogs = process.env.CACHE_LOGS === 'true';

  constructor(options?: LRUCache.Options<string, any, unknown>) {
    this.cache = new LRUCache({ max: 1000, ttl: 1000 * 60 * 5, ...options });
  }

  async get<T>(key: string): Promise<T | undefined> {
    const value = this.cache.get(key);
    if (this.enableLogs) {
      this.logger.debug(`GET ${key}: ${value !== undefined ? JSON.stringify(value) : 'no encontrado'}`);
    }
    return value;
  }

  async set<T>(key: string, val: T, ttlSeconds?: number): Promise<void> {
    this.cache.set(key, val, { ttl: ttlSeconds ? ttlSeconds * 1000 : undefined });
    if (this.enableLogs) {
      this.logger.debug(`SET ${key}: ${JSON.stringify(val)}${ttlSeconds ? ` (TTL: ${ttlSeconds}s)` : ''}`);
    }
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
    if (this.enableLogs) {
      this.logger.debug(`DEL ${key}`);
    }
  }
}
