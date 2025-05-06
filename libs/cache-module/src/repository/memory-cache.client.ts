import { LRUCache } from 'lru-cache';
import { CacheClient } from './cache.repository';

export class MemoryCacheClient implements CacheClient {
  private cache: LRUCache<string, any>;

  constructor(options?: LRUCache.Options<string, any, unknown>) {
    this.cache = new LRUCache({ max: 1000, ttl: 1000 * 60 * 5, ...options });
  }

  async get<T>(key: string): Promise<T | undefined> {
    return this.cache.get(key);
  }

  async set<T>(key: string, val: T, ttlSeconds?: number): Promise<void> {
    this.cache.set(key, val, { ttl: ttlSeconds ? ttlSeconds * 1000 : undefined });
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }
} 