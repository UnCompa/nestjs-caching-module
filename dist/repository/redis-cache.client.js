"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCacheClient = void 0;
const ioredis_1 = require("ioredis");
class RedisCacheClient {
    constructor(standaloneOptions, clusterNodes, clusterOptions) {
        if (clusterNodes && clusterNodes.length > 0) {
            const clusterOpts = Object.assign({ redisOptions: standaloneOptions, enableReadyCheck: true, scaleReads: 'master', maxRedirections: 16 }, clusterOptions);
            this.client = new ioredis_1.default.Cluster(clusterNodes, clusterOpts);
        }
        else {
            this.client = standaloneOptions ? new ioredis_1.default(standaloneOptions) : new ioredis_1.default();
        }
    }
    async exec(fn) {
        return fn().catch(err => {
            throw err;
        });
    }
    async get(key) {
        const val = await this.exec(() => this.client.get(key));
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
        await this.exec(() => ttlSeconds
            ? this.client.set(key, str, 'EX', ttlSeconds)
            : this.client.set(key, str));
    }
    async del(key) {
        await this.exec(() => this.client.del(key));
    }
}
exports.RedisCacheClient = RedisCacheClient;
//# sourceMappingURL=redis-cache.client.js.map