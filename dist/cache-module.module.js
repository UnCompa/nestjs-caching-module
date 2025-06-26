"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CachingModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachingModule = void 0;
const common_1 = require("@nestjs/common");
const cache_module_service_1 = require("./cache-module.service");
const cache_repository_1 = require("./repository/cache.repository");
const memory_cache_client_1 = require("./repository/memory-cache.client");
const redis_cache_client_1 = require("./repository/redis-cache.client");
let CachingModule = CachingModule_1 = class CachingModule {
    static forRoot(options) {
        const cacheClientProvider = {
            provide: cache_repository_1.CACHE_CLIENT,
            useFactory: () => {
                if (options.store === 'redis') {
                    return new redis_cache_client_1.RedisCacheClient(options.standaloneOptions, options.clusterNodes, options.clusterOptions);
                }
                return new memory_cache_client_1.MemoryCacheClient(options.memoryOptions);
            },
        };
        return {
            module: CachingModule_1,
            providers: [cacheClientProvider, cache_module_service_1.CacheModuleService],
            exports: [cache_module_service_1.CacheModuleService],
        };
    }
};
CachingModule = CachingModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], CachingModule);
exports.CachingModule = CachingModule;
//# sourceMappingURL=cache-module.module.js.map