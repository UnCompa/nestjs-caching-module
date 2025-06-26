# NestJS Caching Module

Un módulo de caché configurable para NestJS que soporta almacenamiento en memoria (usando LRU Cache) y Redis (usando ioredis), con soporte opcional de logging para monitoreo y debugging.

## Instalación

```bash
npm install nestjs-caching-module
````

## Configuración

### Configuración Básica

```typescript
import { CachingModule } from 'nestjs-caching-module';

@Module({
  imports: [
    CachingModule.forRoot({
      store: 'memory', // o 'redis'
    }),
  ],
})
export class AppModule {}
```

### Configuración con Redis

```typescript
import { CachingModule } from 'nestjs-caching-module';

@Module({
  imports: [
    CachingModule.forRoot({
      store: 'redis',
      standaloneOptions: {
        host: 'localhost',
        port: 6379,
        // otras opciones de ioredis
      },
      // Opcionalmente, clusterNodes si usas Redis Cluster
      // clusterNodes: [{ host: 'localhost', port: 7000 }],
    }),
  ],
})
export class AppModule {}
```

### Configuración con Memoria (LRU Cache)

```typescript
import { CachingModule } from 'nestjs-caching-module';

@Module({
  imports: [
    CachingModule.forRoot({
      store: 'memory',
      memoryOptions: {
        max: 1000, // número máximo de items
        ttl: 1000 * 60 * 5, // tiempo de vida en milisegundos
      },
    }),
  ],
})
export class AppModule {}
```

## Uso

### Inyectar el Servicio de Caché

```typescript
import { CacheModuleService } from 'nestjs-caching-module';

@Injectable()
export class YourService {
  constructor(private readonly cacheService: CacheModuleService) {}

  async getData(key: string) {
    // Obtener datos del caché
    const cachedData = await this.cacheService.get(key);
    if (cachedData) {
      return cachedData;
    }

    // Si no está en caché, obtener de la fuente original
    const data = await this.getDataFromSource();
    
    // Guardar en caché
    await this.cacheService.set(key, data, 300); // TTL de 300 segundos
    
    return data;
  }
}
```

### Usar el Repositorio con Caché

```typescript
import { CachedRepository } from 'nestjs-caching-module';
import { CacheModuleService } from 'nestjs-caching-module';

@Injectable()
export class YourService {
  private cachedRepo: CachedRepository<YourEntity>;

  constructor(
    private readonly repo: YourRepository,
    private readonly cacheService: CacheModuleService,
  ) {
    this.cachedRepo = new CachedRepository(
      this.repo,
      this.cacheService,
      300, // TTL en segundos
      'your-prefix:', // prefijo para las keys
    );
  }

  async findById(id: string) {
    return this.cachedRepo.findById(id);
  }

  async save(entity: YourEntity) {
    return this.cachedRepo.save(entity);
  }

  async delete(id: string) {
    return this.cachedRepo.delete(id);
  }
}
```

## API

### CacheModuleService

* `get<T>(key: string): Promise<T | undefined>`
* `set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>`
* `del(key: string): Promise<void>`

### CachedRepository

* `findById(id: K): Promise<T | null>`
* `save(entity: T & { id: K }): Promise<T>`
* `delete(id: K): Promise<void>`

## Opciones de Configuración

### Redis Options

Todas las opciones de [ioredis](https://github.com/luin/ioredis#connect-to-redis) son soportadas.

También puedes definir un arreglo `clusterNodes` si deseas usar Redis en modo cluster.

### Memory Options

Opciones de [lru-cache](https://github.com/isaacs/node-lru-cache#options):

* `max`: número máximo de items
* `ttl`: tiempo de vida en milisegundos
* `maxSize`: tamaño máximo en bytes
* `allowStale`: permitir items expirados
* `updateAgeOnGet`: actualizar edad al obtener
* `updateAgeOnHas`: actualizar edad al verificar existencia

## Logging (Opcional)

Para habilitar logs automáticos en consola de cada operación de `get`, `set` y `del`:

1. Establece la variable de entorno `CACHE_LOGS=true`
2. Asegúrate de que tu entorno de NestJS tenga habilitado el nivel de log `debug`

Ejemplo:

```bash
CACHE_LOGS=true npm run start:dev
```

Los logs utilizan el `Logger` de NestJS e incluyen:

* `GET key`: cuando se intenta obtener un valor
* `SET key`: al guardar un valor
* `DEL key`: al eliminar una key
* Eventos de conexión, errores y reconexión en Redis

## Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para sugerir cambios o mejoras.
