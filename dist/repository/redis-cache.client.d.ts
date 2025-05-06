import { RedisOptions } from 'ioredis';
import { CacheClient } from './cache.repository';
export declare class RedisCacheClient implements CacheClient {
    private client;
    constructor(options?: RedisOptions);
    get<T>(key: string): Promise<T | undefined>;
    set<T>(key: string, val: T, ttlSeconds?: number): Promise<void>;
    del(key: string): Promise<void>;
}
