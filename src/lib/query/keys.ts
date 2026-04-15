/**
 * Query Key Factory — memastikan query keys konsisten & type-safe di seluruh app.
 *
 * @example
 * ```ts
 * const userKeys = createQueryKeys('users');
 *
 * userKeys.all              // ['users']
 * userKeys.lists()          // ['users', 'list']
 * userKeys.list({ page: 1 })// ['users', 'list', { page: 1 }]
 * userKeys.details()        // ['users', 'detail']
 * userKeys.detail('abc-123')// ['users', 'detail', 'abc-123']
 * ```
 */

export interface QueryKeyFactory<TDomain extends string = string> {
  /** Invalidate semua cache di domain ini */
  all: readonly [TDomain];
  /** Invalidate semua list cache */
  lists: () => readonly [TDomain, 'list'];
  /** Cache key spesifik untuk sebuah list + filter/params */
  list: <TParams = unknown>(params?: TParams) => readonly [TDomain, 'list', TParams?];
  /** Invalidate semua detail cache */
  details: () => readonly [TDomain, 'detail'];
  /** Cache key spesifik untuk satu detail entity */
  detail: <TId = unknown>(id: TId) => readonly [TDomain, 'detail', TId];
}

export function createQueryKeys<TDomain extends string>(domain: TDomain): QueryKeyFactory<TDomain> {
  return {
    all: [domain] as const,
    lists: () => [domain, 'list'] as const,
    list: <TParams = unknown>(params?: TParams) => [domain, 'list', params] as const,
    details: () => [domain, 'detail'] as const,
    detail: <TId = unknown>(id: TId) => [domain, 'detail', id] as const,
  };
}
