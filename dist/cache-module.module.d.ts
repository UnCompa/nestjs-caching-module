import { DynamicModule } from '@nestjs/common';
import { MemoryCacheClient } from './repository/memory-cache.client';
import { RedisCacheClient } from './repository/redis-cache.client';
export interface CacheModuleOptions {
    store: 'memory' | 'redis';
    memoryOptions?: ConstructorParameters<typeof MemoryCacheClient>[0];
    redisOptions?: ConstructorParameters<typeof RedisCacheClient>[0];
}
export declare class CachingModule {
    static forRoot(options: CacheModuleOptions): DynamicModule;
}
