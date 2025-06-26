"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryCacheClient = void 0;
const common_1 = require("@nestjs/common");
const lru_cache_1 = require("lru-cache");
class MemoryCacheClient {
    constructor(options) {
        this.logger = new common_1.Logger(MemoryCacheClient.name);
        this.enableLogs = process.env.CACHE_LOGS === 'true';
        this.cache = new lru_cache_1.LRUCache(Object.assign({ max: 1000, ttl: 1000 * 60 * 5 }, options));
    }
    async get(key) {
        const value = this.cache.get(key);
        if (this.enableLogs) {
            this.logger.debug(`GET ${key}: ${value !== undefined ? JSON.stringify(value) : 'no encontrado'}`);
        }
        return value;
    }
    async set(key, val, ttlSeconds) {
        this.cache.set(key, val, { ttl: ttlSeconds ? ttlSeconds * 1000 : undefined });
        if (this.enableLogs) {
            this.logger.debug(`SET ${key}: ${JSON.stringify(val)}${ttlSeconds ? ` (TTL: ${ttlSeconds}s)` : ''}`);
        }
    }
    async del(key) {
        this.cache.delete(key);
        if (this.enableLogs) {
            this.logger.debug(`DEL ${key}`);
        }
    }
}
exports.MemoryCacheClient = MemoryCacheClient;
//# sourceMappingURL=memory-cache.client.js.map