import { LRUCache } from 'lru-cache';
import { CacheClient } from './cache.repository';
export declare class MemoryCacheClient implements CacheClient {
    private cache;
    private readonly logger;
    private readonly enableLogs;
    constructor(options?: LRUCache.Options<string, any, unknown>);
    get<T>(key: string): Promise<T | undefined>;
    set<T>(key: string, val: T, ttlSeconds?: number): Promise<void>;
    del(key: string): Promise<void>;
}
