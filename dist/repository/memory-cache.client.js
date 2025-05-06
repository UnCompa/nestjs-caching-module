"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryCacheClient = void 0;
const lru_cache_1 = require("lru-cache");
class MemoryCacheClient {
    constructor(options) {
        this.cache = new lru_cache_1.LRUCache(Object.assign({ max: 1000, ttl: 1000 * 60 * 5 }, options));
    }
    async get(key) {
        return this.cache.get(key);
    }
    async set(key, val, ttlSeconds) {
        this.cache.set(key, val, { ttl: ttlSeconds ? ttlSeconds * 1000 : undefined });
    }
    async del(key) {
        this.cache.delete(key);
    }
}
exports.MemoryCacheClient = MemoryCacheClient;
//# sourceMappingURL=memory-cache.client.js.map