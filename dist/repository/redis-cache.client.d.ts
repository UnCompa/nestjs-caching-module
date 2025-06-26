import { ClusterOptions, RedisOptions } from 'ioredis';
import { CacheClient } from './cache.repository';
export declare class RedisCacheClient implements CacheClient {
    private client;
    constructor(standaloneOptions?: RedisOptions, clusterNodes?: {
        host: string;
        port: number;
        password?: string;
    }[], clusterOptions?: ClusterOptions);
    private exec;
    get<T>(key: string): Promise<T | undefined>;
    set<T>(key: string, val: T, ttlSeconds?: number): Promise<void>;
    del(key: string): Promise<void>;
}
