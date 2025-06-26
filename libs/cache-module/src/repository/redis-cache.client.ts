import { Logger } from '@nestjs/common';
import Redis, { Cluster, ClusterOptions, RedisOptions } from 'ioredis';
import { CacheClient } from './cache.repository';

export class RedisCacheClient implements CacheClient {
  private client: Redis | Cluster;
  private readonly logger = new Logger(RedisCacheClient.name);
  private readonly enableLogs = process.env.CACHE_LOGS === 'true';

  constructor(
    standaloneOptions?: RedisOptions,
    clusterNodes?: { host: string; port: number; password?: string }[],
    clusterOptions?: ClusterOptions
  ) {
    if (clusterNodes && clusterNodes?.every(n => n.host && n.port)) {
      const clusterOpts: ClusterOptions = {
        redisOptions: standaloneOptions,
        enableReadyCheck: true,
        scaleReads: 'master',
        maxRedirections: 16,
        ...(clusterOptions as any),
      };
      this.client = new Redis.Cluster(clusterNodes, clusterOpts);
    } else {
      this.client = standaloneOptions ? new Redis(standaloneOptions) : new Redis();
    }

    this.attachEventListeners();
  }

  private attachEventListeners(): void {
    this.client.on('connect', () => {
      this.logger.log('[Redis] Conectado');
    });

    this.client.on('ready', () => {
      this.logger.log('[Redis] Listo para usar');
    });

    this.client.on('error', (err) => {
      this.logger.error('[Redis] Error:', err);
    });

    this.client.on('reconnecting', () => {
      this.logger.warn('[Redis] Intentando reconectar...');
    });

    this.client.on('end', () => {
      this.logger.warn('[Redis] Conexión cerrada');
    });

    if (this.client instanceof Redis.Cluster) {
      this.client.on('node error', (err, node) => {
        this.logger.error(`[Redis Cluster] Error en nodo ${node.options.host}:${node.options.port}`, err);
      });
    }
  }

  private async exec<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (err) {
      this.logger.error('Error en operación Redis', err);
      throw err;
    }
  }

  async get<T>(key: string): Promise<T | undefined> {
    const val = await this.exec(() => this.client.get(key));
    if (val === null) {
      if (this.enableLogs) this.logger.debug(`GET ${key}: no encontrado`);
      return undefined;
    }
    if (this.enableLogs) this.logger.debug(`GET ${key}: ${val}`);
    try {
      return JSON.parse(val) as T;
    } catch {
      this.logger.warn(`GET ${key}: error al parsear JSON`);
      return undefined;
    }
  }

  async set<T>(key: string, val: T, ttlSeconds?: number): Promise<void> {
    const str = JSON.stringify(val);
    if (this.enableLogs) {
      this.logger.debug(`SET ${key}: ${str} ${ttlSeconds ? `(TTL: ${ttlSeconds}s)` : ''}`);
    }
    await this.exec(() =>
      ttlSeconds
        ? this.client.set(key, str, 'EX', ttlSeconds)
        : this.client.set(key, str)
    );
  }

  async del(key: string): Promise<void> {
    if (this.enableLogs) this.logger.debug(`DEL ${key}`);
    await this.exec(() => this.client.del(key));
  }
}
