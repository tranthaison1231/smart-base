# Data Fetching and Tables

This guide helps feature work choose between Next.js server-side data loading, `fetchJson`, TanStack Query, the shared shadcn-style `Table`, and TanStack Table.

## Current starter defaults

The starter includes `fetchJson` at `apps/web/src/_shared/api/fetch-json.ts` and presentational table primitives at `apps/web/src/_shared/ui/table.tsx`. TanStack Query and TanStack Table are **not installed**. Add either dependency only when a real feature needs it.

## Choose the smallest tool that fits

| Need | Use | Why |
|---|---|---|
| Load data for a server-rendered page with no client refresh or shared cache requirement | A Next.js Server Component and the owning server-side entity/repository; use `fetchJson` for JSON HTTP calls | Keeps initial data loading on the server without adding a client cache |
| Make a one-off client request or submit an action without shared caching, automatic refetching, or optimistic updates | `fetchJson` plus local React state | The existing helper validates JSON responses and handles request errors |
| Share remote data between client components, keep it fresh, refetch it, or coordinate it with mutations, polling, or optimistic updates | TanStack Query | It manages client-side server state, caching, and synchronization |
| Display a simple table with no sorting, filtering, pagination, selection, or column controls | The shared shadcn-style `Table` primitives | They provide semantic table markup and styling without a table-state engine |
| Build an interactive table with sorting, filtering, pagination, row selection, visibility, or resizing | TanStack Table rendered with the shared `Table` primitives | TanStack Table manages table state and row models; the shared primitives render the UI |

TanStack Query and TanStack Table solve different problems. Query owns client-side remote data state; Table owns table state and row processing. They can be used independently or together.

## Data-fetching rules

- Prefer server-side loading for data needed to render a page when the client does not need Query's cache and synchronization behavior.
- Use `fetchJson` for JSON HTTP requests and pass a Zod schema. For PostgreSQL data, call the owning server-side entity/repository instead of making the browser connect to the database.
- Use TanStack Query only for client-managed remote data. Do not use it for form values, toggles, modal state, or other local UI state.
- Keep query keys, query functions, schemas, and mutations with the feature or entity that owns the data. Put them in `_entities/<domain>/` when reused across features; keep them in `_features/<workflow>/` when they serve one workflow. Do not move product-specific queries into `_shared`.
- Include every input that changes the result in the query key, such as search text, filters, sort order, and page. Invalidate the narrowest affected key after a successful mutation.
- Keep credentials, database access, and provider API calls on the server. A client query should call an authorized application route when it needs protected data.

### Where to install and provide TanStack Query

Install it in the web workspace only when a feature needs it:

```bash
pnpm --filter @smart-base/web add @tanstack/react-query
```

When the first Query-based client feature is added, create `apps/web/src/_app/providers.tsx` as a client component, create its `QueryClient` once per provider instance, and mount it from `apps/web/src/app/layout.tsx`. Preserve the existing theme, tooltip, and toast providers. Do not create a module-level QueryClient shared by server requests.

```tsx
"use client"

import { useState, type ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
```

Import `AppProviders` in `apps/web/src/app/layout.tsx` and wrap the existing app providers and route content with it. If server prefetching, dehydration, or Suspense queries are introduced, follow TanStack Query's Next.js SSR guide instead of extending the basic provider blindly.

Place reusable entity queries in a domain-owned module such as `apps/web/src/_entities/<domain>/api/queries.ts`. Place queries used by one workflow in that feature's API module. Keep response schemas near the entity contract and reuse `fetchJson` in query functions:

```ts
import { useQuery } from "@tanstack/react-query"

import { fetchJson } from "@/_shared/api/fetch-json"
import { ProductListSchema } from "../model/product-schema"

type ProductFilters = { page: number; search: string }

export const productKeys = {
  all: ["products"] as const,
  list: (filters: ProductFilters) => ["products", "list", filters] as const,
}

export function useProductList(filters: ProductFilters) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: ({ signal }) => {
      const params = new URLSearchParams({
        page: String(filters.page),
        search: filters.search,
      })

      return fetchJson({
        url: `/api/products?${params}`,
        schema: ProductListSchema,
        errorMessage: "Unable to load products",
        signal,
      })
    },
  })
}
```

This is an illustrative product example; the starter does not include a product entity or route. For writes, define a mutation function beside the owning API operation and invalidate the affected query key in `onSuccess`. Add optimistic updates only when the interaction needs them and test both update and rollback behavior.

## Choose and render a table

Use the shared `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, and `TableCell` directly for static or simple data. Keep loading, empty, and error states in the page, widget, or feature that owns the workflow.

For a table that needs interactive state, install TanStack Table in the web workspace:

```bash
pnpm --filter @smart-base/web add @tanstack/react-table
```

Keep column definitions beside the table's owning UI, usually under its feature or widget. TanStack Table is headless, so render its header groups and cells with the shared primitives:

```tsx
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { useState } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/_shared/ui/table"

type Product = { id: string; name: string }

export function ProductTable({
  rows,
  columns,
}: {
  rows: Product[]
  columns: ColumnDef<Product>[]
}) {
  const [sorting, setSorting] = useState<SortingState>([])
  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  })

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((group) => (
          <TableRow key={group.id}>
            {group.headers.map((header) => (
              <TableHead
                key={header.id}
                aria-sort={
                  header.column.getIsSorted() === "asc"
                    ? "ascending"
                    : header.column.getIsSorted() === "desc"
                      ? "descending"
                      : undefined
                }
              >
                {header.isPlaceholder ? null : header.column.getCanSort() ? (
                  <button
                    type="button"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </button>
                ) : (
                  flexRender(header.column.columnDef.header, header.getContext())
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length}>No products found.</TableCell>
          </TableRow>
        ) : (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
```

Add only the row models and controlled state for interactions the feature actually needs, such as `getSortedRowModel` with sorting state or `getFilteredRowModel` with filter state. Use keyboard-accessible controls in headers and preserve sort state in `aria-sort`. Do not add a table engine solely to render cells.

### Server-side tables

For a dataset small enough to load completely, TanStack Table can sort and paginate it in the browser. For large or permission-filtered datasets, keep filtering, sorting, and pagination on the server:

1. Keep table state (page, sort, and filters) in the owning feature; use URL search parameters when the state should be shareable or survive refreshes.
2. Include that state in the TanStack Query key and send it to the API route.
3. Configure TanStack Table with the relevant `manualPagination`, `manualSorting`, or `manualFiltering` options and pass the server's `rowCount`.
4. Render the rows returned by the server. Manual mode tells TanStack Table to skip that client-side row model; it does not fetch or process data on the server.

Use TanStack Query with TanStack Table when the interactive server-backed table benefits from client caching, refetching, or mutation invalidation. A server-rendered table does not need TanStack Query just because it uses TanStack Table.

## Official references

- [TanStack Query: Quick Start](https://tanstack.com/query/latest/docs/framework/react/quick-start)
- [TanStack Query: Query Keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
- [TanStack Query: Advanced Server Rendering](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr)
- [TanStack Table: Introduction](https://tanstack.com/table/latest/docs/introduction)
- [TanStack Table: Pagination](https://tanstack.com/table/latest/docs/guide/pagination)
- [TanStack Table: Sorting](https://tanstack.com/table/latest/docs/guide/sorting)
