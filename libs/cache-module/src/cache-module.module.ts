import { DynamicModule, Global, Module } from '@nestjs/common';
import { ClusterOptions, RedisOptions } from 'ioredis';
import { CacheModuleService } from './cache-module.service';
import { CACHE_CLIENT } from './repository/cache.repository';
import { MemoryCacheClient } from './repository/memory-cache.client';
import { RedisCacheClient } from './repository/redis-cache.client';


export interface CacheModuleOptions {
  store: 'memory' | 'redis';
  memoryOptions?: ConstructorParameters<typeof MemoryCacheClient>[0];
  standaloneOptions?: RedisOptions;
  clusterNodes?: { host: string; port: number; password?: string }[];
  clusterOptions?: ClusterOptions;
}

@Global()
@Module({})
export class CachingModule {
  static forRoot(options: CacheModuleOptions): DynamicModule {
    const cacheClientProvider = {
      provide: CACHE_CLIENT,
      useFactory: () => {
        if (options.store === 'redis') {
          return new RedisCacheClient(
            options.standaloneOptions,
            options.clusterNodes,
            options.clusterOptions
          );
        }
        return new MemoryCacheClient(options.memoryOptions);
      },
    };

    return {
      module: CachingModule,
      providers: [cacheClientProvider, CacheModuleService],
      exports: [CacheModuleService],
    };
  }
}
