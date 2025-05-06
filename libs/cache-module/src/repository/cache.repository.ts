// src/common/cached.repository.ts

import { BaseRepository } from "../interfaces/cache.interface";

export const CACHE_CLIENT = 'CACHE_CLIENT';

export interface CacheClient {
  get<T>(key: string): T | undefined | Promise<T | undefined>;
  set<T>(key: string, val: T, ttlSeconds?: number): void | Promise<void>;
  del(key: string): void | Promise<void>;
}

export class CachedRepository<T, K = string> implements BaseRepository<T, K> {
  constructor(
    private readonly repo: BaseRepository<T, K>,
    private readonly cache: CacheClient,
    private readonly ttlSeconds = 300,
    private readonly prefix = '',
  ) { }

  private makeKey(id: K) {
    return `${this.prefix}${id}`;
  }

  async findById(id: K): Promise<T | null> {
    const key = this.makeKey(id);
    // 1) Intentar desde caché
    const cached = await this.cache.get<T>(key);
    if (cached) {
      return cached;
    }
    // 2) Si no está, cargar de la fuente
    const entity = await this.repo.findById(id);
    if (entity) {
      // 3) Guardar en caché
      await this.cache.set(key, entity, this.ttlSeconds);
    }
    return entity;
  }

  async save(entity: T & { id: K }): Promise<T> {
    const saved = await this.repo.save(entity) as T & { id: K };
    // invalidar o actualizar caché
    const key = this.makeKey(saved.id);
    await this.cache.set(key, saved, this.ttlSeconds);
    return saved;
  }

  async delete(id: K): Promise<void> {
    await this.repo.delete(id);
    await this.cache.del(this.makeKey(id));
  }
}
