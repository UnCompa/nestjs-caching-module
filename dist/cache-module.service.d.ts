import { CacheClient } from './repository/cache.repository';
export declare class CacheModuleService {
    private readonly cache;
    constructor(cache: CacheClient);
    get<T>(key: string): Promise<T | undefined>;
    set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
    del(key: string): Promise<void>;
}
