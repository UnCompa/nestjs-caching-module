"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCacheClient = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
class RedisCacheClient {
    constructor(standaloneOptions, clusterNodes, clusterOptions) {
        this.logger = new common_1.Logger(RedisCacheClient.name);
        this.enableLogs = process.env.CACHE_LOGS === 'true';
        if (clusterNodes && (clusterNodes === null || clusterNodes === void 0 ? void 0 : clusterNodes.every(n => n.host && n.port))) {
            const clusterOpts = Object.assign({ redisOptions: standaloneOptions, enableReadyCheck: true, scaleReads: 'master', maxRedirections: 16 }, clusterOptions);
            this.client = new ioredis_1.default.Cluster(clusterNodes, clusterOpts);
        }
        else {
            this.client = standaloneOptions ? new ioredis_1.default(standaloneOptions) : new ioredis_1.default();
        }
        this.attachEventListeners();
    }
    attachEventListeners() {
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
        if (this.client instanceof ioredis_1.default.Cluster) {
            this.client.on('node error', (err, node) => {
                this.logger.error(`[Redis Cluster] Error en nodo ${node.options.host}:${node.options.port}`, err);
            });
        }
    }
    async exec(fn) {
        try {
            return await fn();
        }
        catch (err) {
            this.logger.error('Error en operación Redis', err);
            throw err;
        }
    }
    async get(key) {
        const val = await this.exec(() => this.client.get(key));
        if (val === null) {
            if (this.enableLogs)
                this.logger.debug(`GET ${key}: no encontrado`);
            return undefined;
        }
        if (this.enableLogs)
            this.logger.debug(`GET ${key}: ${val}`);
        try {
            return JSON.parse(val);
        }
        catch (_a) {
            this.logger.warn(`GET ${key}: error al parsear JSON`);
            return undefined;
        }
    }
    async set(key, val, ttlSeconds) {
        const str = JSON.stringify(val);
        if (this.enableLogs) {
            this.logger.debug(`SET ${key}: ${str} ${ttlSeconds ? `(TTL: ${ttlSeconds}s)` : ''}`);
        }
        await this.exec(() => ttlSeconds
            ? this.client.set(key, str, 'EX', ttlSeconds)
            : this.client.set(key, str));
    }
    async del(key) {
        if (this.enableLogs)
            this.logger.debug(`DEL ${key}`);
        await this.exec(() => this.client.del(key));
    }
}
exports.RedisCacheClient = RedisCacheClient;
//# sourceMappingURL=redis-cache.client.js.map