# TanStack Query + Axios — Implementation Guide

Architecture & pattern guide untuk tim developer.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Folder Structure](#folder-structure)
3. [Menambahkan Domain API Baru (Step-by-Step)](#menambahkan-domain-api-baru)
4. [Query Key Convention](#query-key-convention)
5. [Pattern: Custom Query Hook](#pattern-custom-query-hook)
6. [Pattern: Custom Mutation Hook](#pattern-custom-mutation-hook)
7. [Pattern: Paginated Query](#pattern-paginated-query)
8. [Pattern: Dependent / Conditional Query](#pattern-dependent--conditional-query)
9. [Pattern: Optimistic Update](#pattern-optimistic-update)
10. [SSR Patterns (Next.js App Router)](#ssr-patterns-nextjs-app-router)
11. [Tips & Best Practices](#tips--best-practices)
12. [Testing Guide](#testing-guide)

---

## Architecture Overview

```
Page / Component
        │  useXxxQuery()  /  useXxxMutation()
        ▼
┌──────────────────────┐
│   Custom Hooks       │  ← hooks/queries/use*Queries.ts
│   (TanStack Query)   │     Thin wrappers over useQuery / useMutation
└──────────┬───────────┘
           │  calls service methods
           ▼
┌──────────────────────┐
│   Service Layer      │  ← services/*Service.ts
│   (extends Base)     │     Pure async functions, no React dependency
└──────────┬───────────┘
           │  this.get() / this.post() / ...
           ▼
┌──────────────────────┐
│   BaseApiService     │  ← services/api.service.ts
│   (Axios wrapper)    │     Auto-unwraps response.data
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Axios Instance     │  ← lib/axios/instances.ts
│   + Interceptors     │     Auth token, error handling, logging
└──────────────────────┘
```

**Kenapa 3 layer?**

| Layer | Tanggung jawab | Testability |
|-------|---------------|-------------|
| **Hooks** | Caching, reactivity, UI state (loading/error) | Integration test with render |
| **Service** | HTTP call orchestration, URL building | Unit test with mock axios |
| **Axios** | Transport, auth, retry, interceptors | Unit test |

---

## Folder Structure

```
src/
├── constants/
│   └── apiConfig.ts              # API base URL, timeout, dll
│
├── lib/
│   ├── axios/
│   │   ├── types.ts              # AxiosInstanceConfig
│   │   ├── createInstance.ts     # Factory function
│   │   ├── interceptors.ts       # Request/response interceptors
│   │   ├── instances.ts          # apiClient (pre-configured)
│   │   └── index.ts              # Barrel export
│   │
│   └── query/
│       ├── types.ts              # ApiResponse, PaginatedResponse, ApiError
│       ├── queryClient.ts        # QueryClient factory + singleton
│       ├── keys.ts               # createQueryKeys() factory
│       └── index.ts              # Barrel export
│
├── services/
│   ├── api.service.ts            # BaseApiService abstract class
│   ├── user.service.ts           # ← contoh domain service
│   └── index.ts
│
├── hooks/
│   ├── queries/
│   │   └── useUserQueries.ts     # ← contoh domain hooks
│   └── index.ts                  # Re-export semua hooks
│
└── components/providers/
    └── Providers.tsx             # QueryClientProvider + Devtools
```

---

## Menambahkan Domain API Baru

Contoh: menambahkan domain **User**.

### Step 1 — Definisikan Types

```ts
// src/types/user.ts  (atau bisa di file service-nya langsung)
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}
```

### Step 2 — Buat Service

```ts
// src/services/user.service.ts
import { BaseApiService } from './api.service';
import type { ApiResponse, PaginatedResponse } from '@/lib/query';
import type { User, CreateUserDto, UpdateUserDto, GetUsersParams } from '@/types/user';

class UserService extends BaseApiService {
  getUsers(params?: GetUsersParams) {
    return this.get<PaginatedResponse<User>>('/users', { params });
  }

  getUserById(id: string) {
    return this.get<ApiResponse<User>>(`/users/${id}`);
  }

  createUser(payload: CreateUserDto) {
    return this.post<ApiResponse<User>>('/users', payload);
  }

  updateUser(id: string, payload: UpdateUserDto) {
    return this.put<ApiResponse<User>>(`/users/${id}`, payload);
  }

  deleteUser(id: string) {
    return this.delete<ApiResponse<void>>(`/users/${id}`);
  }
}

export const userService = new UserService();
```

### Step 3 — Buat Query Hooks

```ts
// src/hooks/queries/useUserQueries.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { createQueryKeys, type ApiResponse, type PaginatedResponse } from '@/lib/query';
import { userService } from '@/services/user.service';
import type { User, CreateUserDto, UpdateUserDto, GetUsersParams } from '@/types/user';

// ─── Query Keys ──────────────────────────────────────────────────────────────
export const userKeys = createQueryKeys('users');

// ─── Queries ─────────────────────────────────────────────────────────────────

export const useUsers = (
  params?: GetUsersParams,
  options?: Partial<UseQueryOptions<PaginatedResponse<User>>>,
) =>
  useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userService.getUsers(params),
    ...options,
  });

export const useUser = (
  id: string,
  options?: Partial<UseQueryOptions<ApiResponse<User>>>,
) =>
  useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
    ...options,
  });

// ─── Mutations ───────────────────────────────────────────────────────────────

export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateUserDto) => userService.createUser(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateUserDto }) =>
      userService.updateUser(id, dto),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      qc.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};
```

### Step 4 — Export dari Barrel

```ts
// src/hooks/index.ts
export { useUsers, useUser, useCreateUser, useUpdateUser, useDeleteUser } from './queries/useUserQueries';
```

### Step 5 — Gunakan di Page / Component

```tsx
// src/app/users/page.tsx
'use client';

import { useUsers, useDeleteUser } from '@/hooks';

export default function UsersPage() {
  const { data, isLoading, error } = useUsers({ page: 1, limit: 10 });
  const deleteUser = useDeleteUser();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data?.data.items.map((user) => (
        <li key={user.id}>
          {user.name}
          <button onClick={() => deleteUser.mutate(user.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

---

## Query Key Convention

Menggunakan `createQueryKeys()` factory untuk konsistensi:

```ts
const userKeys = createQueryKeys('users');

// Hierarchy (penting untuk invalidation):
userKeys.all                    // ['users']              → invalidate SEMUA cache users
userKeys.lists()                // ['users', 'list']      → invalidate SEMUA list
userKeys.list({ page: 1 })     // ['users', 'list', { page: 1 }]
userKeys.details()              // ['users', 'detail']    → invalidate SEMUA detail
userKeys.detail('abc-123')      // ['users', 'detail', 'abc-123']
```

**Invalidation strategy:**

```ts
// Setelah create → invalidate semua list (biar refetch)
qc.invalidateQueries({ queryKey: userKeys.lists() });

// Setelah update → invalidate detail spesifik + lists
qc.invalidateQueries({ queryKey: userKeys.detail(id) });
qc.invalidateQueries({ queryKey: userKeys.lists() });

// Nuclear option → invalidate everything
qc.invalidateQueries({ queryKey: userKeys.all });
```

---

## Pattern: Custom Query Hook

```ts
export const useUsers = (
  params?: GetUsersParams,
  options?: Partial<UseQueryOptions<PaginatedResponse<User>>>,
) =>
  useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userService.getUsers(params),
    ...options,   // ← consumer bisa override staleTime, enabled, dll
  });
```

**Kenapa pattern ini?**
- `queryKey` otomatis berubah saat `params` berubah → auto-refetch
- `options` spread di akhir → consumer tetap bisa customize
- Service layer di-inject via closure → mudah di-test

---

## Pattern: Custom Mutation Hook

```ts
export const useCreateUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateUserDto) => userService.createUser(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};
```

**Usage di component:**

```tsx
const createUser = useCreateUser();

const handleSubmit = (formData: CreateUserDto) => {
  createUser.mutate(formData, {
    onSuccess: () => toast.success('User created!'),
    onError: (err) => toast.error(err.message),
  });
};
```

> Note: `onSuccess`/`onError` di `.mutate()` bersifat **additive** — 
> tidak menggantikan yang di hook definition.

---

## Pattern: Paginated Query

```ts
export const useUsers = (params: { page: number; limit: number }) =>
  useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userService.getUsers(params),
    placeholderData: keepPreviousData,  // ← smooth pagination, no loading flash
  });
```

```tsx
import { keepPreviousData } from '@tanstack/react-query';

const [page, setPage] = useState(1);
const { data, isPlaceholderData } = useUsers({ page, limit: 10 });

<button
  disabled={isPlaceholderData || page <= 1}
  onClick={() => setPage((p) => p - 1)}
>
  Prev
</button>
```

---

## Pattern: Dependent / Conditional Query

```ts
export const useUserOrders = (userId: string | undefined) =>
  useQuery({
    queryKey: orderKeys.list({ userId }),
    queryFn: () => orderService.getByUser(userId!),
    enabled: !!userId,  // ← tidak akan fetch sampai userId tersedia
  });
```

---

## Pattern: Optimistic Update

```ts
export const useUpdateUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateUserDto }) =>
      userService.updateUser(id, dto),

    onMutate: async ({ id, dto }) => {
      // Cancel outgoing refetches
      await qc.cancelQueries({ queryKey: userKeys.detail(id) });

      // Snapshot previous value
      const previous = qc.getQueryData<ApiResponse<User>>(userKeys.detail(id));

      // Optimistically update
      if (previous) {
        qc.setQueryData<ApiResponse<User>>(userKeys.detail(id), {
          ...previous,
          data: { ...previous.data, ...dto },
        });
      }

      return { previous };
    },

    onError: (_err, { id }, context) => {
      // Rollback on error
      if (context?.previous) {
        qc.setQueryData(userKeys.detail(id), context.previous);
      }
    },

    onSettled: (_data, _err, { id }) => {
      // Refetch to ensure server state
      qc.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
  });
};
```

---

## SSR Patterns (Next.js App Router)

Arsitektur `getQueryClient()` yang kita buat sudah SSR-ready:
- **Server** → selalu return `new QueryClient()` (fresh, tidak bocor antar-request)
- **Browser** → reuse singleton (cache persistent)

TanStack Query v5 menyediakan 2 strategi SSR untuk Next.js App Router:

### Strategi 1: Prefetch + Dehydrate (Recommended)

Pattern utama — data di-fetch di Server Component, di-serialize via `dehydrate()`,
lalu di-hydrate di client. Client langsung dapat data **tanpa loading spinner**.

```
┌─────────────────────────────┐
│  Server Component (page)    │
│  ┌────────────────────────┐ │
│  │ prefetchQuery()        │ │  ← fetch data di server
│  │ dehydrate(queryClient) │ │  ← serialize cache
│  └────────┬───────────────┘ │
│           ▼                 │
│  <HydrationBoundary>        │  ← transfer cache ke client
│    <ClientComponent />      │
│  </HydrationBoundary>       │
└─────────────────────────────┘
           ▼
┌─────────────────────────────┐
│  Client Component           │
│  useUsers() → instant data  │  ← useQuery membaca dari hydrated cache
│  (no loading state!)        │
└─────────────────────────────┘
```

#### Step 1 — Server Component (page.tsx)

```tsx
// src/app/users/page.tsx  — Server Component (NO 'use client')
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query';
import { userKeys } from '@/hooks/queries/useUserQueries';
import { userService } from '@/services/user.service';
import UserListClient from './UserListClient';

export default async function UsersPage() {
  const queryClient = getQueryClient();

  // Prefetch di server — data masuk ke queryClient cache
  await queryClient.prefetchQuery({
    queryKey: userKeys.list({ page: 1, limit: 10 }),
    queryFn: () => userService.getUsers({ page: 1, limit: 10 }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserListClient />
    </HydrationBoundary>
  );
}
```

#### Step 2 — Client Component

```tsx
// src/app/users/UserListClient.tsx
'use client';

import { useUsers } from '@/hooks';

export default function UserListClient() {
  // Data LANGSUNG tersedia dari hydrated cache — no loading state on first render
  const { data, isLoading } = useUsers({ page: 1, limit: 10 });

  // isLoading akan false pada initial render karena data sudah di-prefetch
  if (isLoading) return <p>Loading...</p>;

  return (
    <ul>
      {data?.data.items.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

#### Prefetch Multiple Queries

Untuk page yang butuh beberapa data sekaligus, gunakan `Promise.all`:

```tsx
// src/app/dashboard/page.tsx
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query';
import { userKeys } from '@/hooks/queries/useUserQueries';
import { orderKeys } from '@/hooks/queries/useOrderQueries';
import { userService } from '@/services/user.service';
import { orderService } from '@/services/order.service';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const queryClient = getQueryClient();

  // Parallel prefetch — tidak saling blocking
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: userKeys.list({ page: 1 }),
      queryFn: () => userService.getUsers({ page: 1 }),
    }),
    queryClient.prefetchQuery({
      queryKey: orderKeys.list({ status: 'pending' }),
      queryFn: () => orderService.getOrders({ status: 'pending' }),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardClient />
    </HydrationBoundary>
  );
}
```

#### Prefetch dengan Dynamic Params

```tsx
// src/app/users/[id]/page.tsx
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query';
import { userKeys } from '@/hooks/queries/useUserQueries';
import { userService } from '@/services/user.service';
import UserDetailClient from './UserDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: Props) {
  const { id } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getUserById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserDetailClient id={id} />
    </HydrationBoundary>
  );
}
```

```tsx
// src/app/users/[id]/UserDetailClient.tsx
'use client';

import { useUser } from '@/hooks';

export default function UserDetailClient({ id }: { id: string }) {
  const { data } = useUser(id);
  // data tersedia langsung — no flash

  return <h1>{data?.data.name}</h1>;
}
```

### Strategi 2: Server-Only Fetch (Tanpa TanStack Query)

Untuk data yang **hanya dibutuhkan di server** dan tidak perlu revalidation/caching
dari TanStack Query di client. Biasa digunakan untuk static/metadata.

```tsx
// src/app/users/[id]/page.tsx
import { userService } from '@/services/user.service';

export default async function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Langsung panggil service — no TanStack Query, pure RSC
  const response = await userService.getUserById(id);

  return (
    <div>
      <h1>{response.data.name}</h1>
      <p>{response.data.email}</p>
    </div>
  );
}
```

> **Kapan pakai strategi ini?** Saat data tidak butuh client-side cache,
> revalidation, atau background refetch. Contoh: SEO metadata, static content.

### Strategi 3: Hybrid — Server Prefetch + Client Interaction

Pattern paling umum untuk halaman interaktif: data awal di-prefetch server-side,
lalu user bisa filter/paginate di client.

```tsx
// src/app/users/page.tsx  — Server Component
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query';
import { userKeys } from '@/hooks/queries/useUserQueries';
import { userService } from '@/services/user.service';
import UserListInteractive from './UserListInteractive';

export default async function UsersPage() {
  const queryClient = getQueryClient();

  // Prefetch halaman pertama
  await queryClient.prefetchQuery({
    queryKey: userKeys.list({ page: 1, limit: 10 }),
    queryFn: () => userService.getUsers({ page: 1, limit: 10 }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserListInteractive />
    </HydrationBoundary>
  );
}
```

```tsx
// src/app/users/UserListInteractive.tsx
'use client';

import { useState } from 'react';
import { useUsers, useDeleteUser } from '@/hooks';
import { keepPreviousData } from '@tanstack/react-query';

export default function UserListInteractive() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  // page=1 langsung dari hydrated cache (instant)
  // page>1 atau search berubah → fetch di client (with loading)
  const { data, isLoading, isPlaceholderData } = useUsers(
    { page, limit: 10, search: search || undefined },
    { placeholderData: keepPreviousData },
  );
  const deleteUser = useDeleteUser();

  return (
    <div>
      <input
        placeholder="Search users..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); // Reset ke halaman 1 saat search berubah
        }}
      />

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul style={{ opacity: isPlaceholderData ? 0.5 : 1 }}>
          {data?.data.items.map((user) => (
            <li key={user.id}>
              {user.name}
              <button onClick={() => deleteUser.mutate(user.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      <div>
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>
        <span>Page {page}</span>
        <button
          disabled={isPlaceholderData || !data?.data.totalPages || page >= data.data.totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

### SSR: Decision Matrix

| Scenario | Pattern | Cache di Client? |
|----------|---------|-------------------|
| Data interaktif (tabel, filter, CRUD) | **Prefetch + Dehydrate** | Ya |
| Data awal + pagination/search client | **Hybrid** | Ya |
| Static/metadata-only | **Server-Only Fetch** | Tidak |
| Data yang sering berubah real-time | CSR saja (`useQuery` tanpa prefetch) | Ya |

### SSR: Hal yang Perlu Diperhatikan

1. **`getQueryClient()` di server selalu return instance baru** — ini by design, mencegah cache leak antar-request user yang berbeda.

2. **`staleTime` penting untuk SSR** — default kita 60 detik. Artinya data yang di-prefetch dianggap fresh selama 1 menit; client tidak akan refetch ulang sampai expired.

3. **Error handling di server prefetch** — jika prefetch gagal, TanStack Query **tidak throw**. Client component akan tetap render dan `useQuery` akan retry di client.

4. **Jangan prefetch data user-specific tanpa auth context** — interceptor auth (`localStorage`) tidak tersedia di server. Untuk data yang butuh auth di server, pass token via cookies:

```tsx
// Alternatif: buat server-side axios instance dengan cookie
import { cookies } from 'next/headers';
import { createAxiosInstance } from '@/lib/axios';

async function getServerApiClient() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  return createAxiosInstance({
    baseURL: process.env.API_BASE_URL, // internal URL, bukan public
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
```

5. **Nested `HydrationBoundary`** boleh — bisa dipakai di nested layout:

```tsx
// src/app/dashboard/layout.tsx
export default async function DashboardLayout({ children }) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: notificationKeys.list(),
    queryFn: () => notificationService.getUnread(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardNav />
      {children}  {/* children bisa punya HydrationBoundary sendiri */}
    </HydrationBoundary>
  );
}
```

---

## Tips & Best Practices

### DO ✓

- **Satu file hooks per domain** — `useUserQueries.ts`, `useOrderQueries.ts`
- **Satu singleton service per domain** — `export const userService = new UserService()`
- **Selalu gunakan `createQueryKeys()`** — jangan hardcode string array
- **Export hooks dari barrel** `hooks/index.ts` — import jadi clean
- **Gunakan `enabled`** untuk conditional fetching, bukan `if` di component
- **Gunakan `placeholderData: keepPreviousData`** untuk pagination

### DON'T ✗

- **Jangan panggil `useQuery` langsung di page** — wrap di custom hook
- **Jangan share service instance lintas test** — setiap test buat mock baru
- **Jangan manual `.then(r => r.data)`** — `BaseApiService` sudah unwrap
- **Jangan `invalidateQueries` dengan exact key** — gunakan hierarchy key
- **Jangan taruh business logic di hooks** — simpan di service layer

### Error Handling

Error handling sudah di-handle secara global:
- **Interceptor** → inject token, dispatch event 401
- **QueryClient** → log semua error via `queryCache.onError`
- **Retry** → 4xx tidak retry, 5xx retry max 2x

Untuk per-query custom error handling:

```tsx
const { error } = useUser(id);

// error sudah typed sebagai AxiosError
if (error?.response?.status === 404) {
  return <NotFound />;
}
```

---

## Testing Guide

### Test Service Layer

```ts
// test/services/user.service.test.ts
import type { AxiosInstance } from 'axios';
import { UserService } from '@/services/user.service';

// Buat instance baru dengan mock axios
const mockHttp = {
  get: jest.fn(),
  post: jest.fn(),
} as unknown as jest.Mocked<AxiosInstance>;

// Menggunakan constructor injection untuk testing
const service = new (class extends UserService {
  constructor() { super(mockHttp); }
})();

it('should call GET /users', async () => {
  mockHttp.get.mockResolvedValue({ data: { items: [] } });
  await service.getUsers({ page: 1 });
  expect(mockHttp.get).toHaveBeenCalledWith('/users', { params: { page: 1 } });
});
```

### Test Query Hooks

```tsx
// test/hooks/useUserQueries.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUsers } from '@/hooks/queries/useUserQueries';

jest.mock('@/services/user.service', () => ({
  userService: {
    getUsers: jest.fn().mockResolvedValue({
      data: { items: [{ id: '1', name: 'Alice' }], total: 1 },
    }),
  },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })}>
    {children}
  </QueryClientProvider>
);

it('should fetch users', async () => {
  const { result } = renderHook(() => useUsers({ page: 1 }), { wrapper });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data?.data.items).toHaveLength(1);
});
```

---

## Quick Reference: File Checklist per Domain

Saat menambahkan domain baru, buat file-file berikut:

| # | File | Isi |
|---|------|-----|
| 1 | `src/types/{domain}.ts` | Interface / Type |
| 2 | `src/services/{domain}.service.ts` | Service class extends `BaseApiService` |
| 3 | `src/hooks/queries/use{Domain}Queries.ts` | Query keys + hooks |
| 4 | `src/hooks/index.ts` | Tambah re-export |
| 5 | `test/services/{domain}.service.test.ts` | Unit test service |
| 6 | `test/hooks/use{Domain}Queries.test.tsx` | Unit test hooks |
