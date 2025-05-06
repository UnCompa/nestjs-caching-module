export interface BaseRepository<T, K = string> {
  findById(id: K): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: K): Promise<void>;
}
