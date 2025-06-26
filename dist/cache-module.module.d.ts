import { DynamicModule } from '@nestjs/common';
import { ClusterOptions, RedisOptions } from 'ioredis';
import { MemoryCacheClient } from './repository/memory-cache.client';
export interface CacheModuleOptions {
    store: 'memory' | 'redis';
    memoryOptions?: ConstructorParameters<typeof MemoryCacheClient>[0];
    standaloneOptions?: RedisOptions;
    clusterNodes?: {
        host: string;
        port: number;
        password?: string;
    }[];
    clusterOptions?: ClusterOptions;
}
export declare class CachingModule {
    static forRoot(options: CacheModuleOptions): DynamicModule;
}
