"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedRepository = exports.CACHE_CLIENT = void 0;
exports.CACHE_CLIENT = 'CACHE_CLIENT';
class CachedRepository {
    constructor(repo, cache, ttlSeconds = 300, prefix = '') {
        this.repo = repo;
        this.cache = cache;
        this.ttlSeconds = ttlSeconds;
        this.prefix = prefix;
    }
    makeKey(id) {
        return `${this.prefix}${id}`;
    }
    async findById(id) {
        const key = this.makeKey(id);
        const cached = await this.cache.get(key);
        if (cached) {
            return cached;
        }
        const entity = await this.repo.findById(id);
        if (entity) {
            await this.cache.set(key, entity, this.ttlSeconds);
        }
        return entity;
    }
    async save(entity) {
        const saved = await this.repo.save(entity);
        const key = this.makeKey(saved.id);
        await this.cache.set(key, saved, this.ttlSeconds);
        return saved;
    }
    async delete(id) {
        await this.repo.delete(id);
        await this.cache.del(this.makeKey(id));
    }
}
exports.CachedRepository = CachedRepository;
//# sourceMappingURL=cache.repository.js.map