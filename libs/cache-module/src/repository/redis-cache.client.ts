import Redis, { Cluster, ClusterOptions, RedisOptions } from 'ioredis';
import { CacheClient } from './cache.repository';

export class RedisCacheClient implements CacheClient {
  private client: Redis | Cluster;

  constructor(
    standaloneOptions?: RedisOptions,
    clusterNodes?: { host: string; port: number; password?: string }[],
    clusterOptions?: ClusterOptions
  ) {
    if (clusterNodes && clusterNodes.length > 0) {
      const clusterOpts: ClusterOptions = {
        redisOptions: standaloneOptions,
        enableReadyCheck: true,
        scaleReads: 'master',
        maxRedirections: 16,
        // personalizado según necesidades...
        ...(clusterOptions as any),
      };
      this.client = new Redis.Cluster(clusterNodes, clusterOpts);
    } else {
      this.client = standaloneOptions ? new Redis(standaloneOptions) : new Redis();
    }
  }

  private async exec<T>(fn: () => Promise<T>): Promise<T> {
    return fn().catch(err => {
      // aquí puedes agregar manejo global de errores/reintentos
      throw err;
    });
  }

  async get<T>(key: string): Promise<T | undefined> {
    const val = await this.exec(() => this.client.get(key));
    if (val === null) return undefined;
    try { return JSON.parse(val) as T; }
    catch { return undefined; }
  }

  async set<T>(key: string, val: T, ttlSeconds?: number): Promise<void> {
    const str = JSON.stringify(val);
    await this.exec(() =>
      ttlSeconds
        ? this.client.set(key, str, 'EX', ttlSeconds)
        : this.client.set(key, str)
    );
  }

  async del(key: string): Promise<void> {
    await this.exec(() => this.client.del(key));
  }
}
