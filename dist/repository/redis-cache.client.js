"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCacheClient = void 0;
const ioredis_1 = require("ioredis");
class RedisCacheClient {
    constructor(options) {
        this.client = options ? new ioredis_1.default(options) : new ioredis_1.default();
    }
    async get(key) {
        const val = await this.client.get(key);
        if (val === null)
            return undefined;
        try {
            return JSON.parse(val);
        }
        catch (_a) {
            return undefined;
        }
    }
    async set(key, val, ttlSeconds) {
        const str = JSON.stringify(val);
        if (ttlSeconds) {
            await this.client.set(key, str, 'EX', ttlSeconds);
        }
        else {
            await this.client.set(key, str);
        }
    }
    async del(key) {
        await this.client.del(key);
    }
}
exports.RedisCacheClient = RedisCacheClient;
//# sourceMappingURL=redis-cache.client.js.map