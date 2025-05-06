import { Inject, Injectable } from '@nestjs/common';
import { CACHE_CLIENT, CacheClient } from './repository/cache.repository';

@Injectable()
export class CacheModuleService {
  constructor(@Inject(CACHE_CLIENT) private readonly cache: CacheClient) {}

  async get<T>(key: string): Promise<T | undefined> {
    return this.cache.get<T>(key);
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    return this.cache.set<T>(key, value, ttlSeconds);
  }

  async del(key: string): Promise<void> {
    return this.cache.del(key);
  }
}