import { BaseRepository } from "../interfaces/cache.interface";
export declare const CACHE_CLIENT = "CACHE_CLIENT";
export interface CacheClient {
    get<T>(key: string): T | undefined | Promise<T | undefined>;
    set<T>(key: string, val: T, ttlSeconds?: number): void | Promise<void>;
    del(key: string): void | Promise<void>;
}
export declare class CachedRepository<T, K = string> implements BaseRepository<T, K> {
    private readonly repo;
    private readonly cache;
    private readonly ttlSeconds;
    private readonly prefix;
    constructor(repo: BaseRepository<T, K>, cache: CacheClient, ttlSeconds?: number, prefix?: string);
    private makeKey;
    findById(id: K): Promise<T | null>;
    save(entity: T & {
        id: K;
    }): Promise<T>;
    delete(id: K): Promise<void>;
}
