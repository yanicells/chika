# Chika - AI Coding Instructions

## Architecture Overview

Anonymous notes + personal blog app using **Next.js 16 App Router**, **React 19**, **Drizzle ORM** (Neon PostgreSQL), **Better Auth** (GitHub OAuth), and **Catppuccin Mocha** theme.

**Two user types**: Public users (view/create notes, comment) and Admin (full CRUD, private notes, blog posts).

## Critical Patterns

### Server Actions Pattern (All Mutations)

```typescript
// lib/actions/[feature]-actions.ts
"use server";
import { revalidateTag, revalidatePath } from "next/cache";
import { requireAdmin, getCurrentSession } from "@/lib/auth-helper";

export async function createThing(data) {
  const session = await getCurrentSession();
  const isAdmin = session?.user?.role === "admin";

  await db.insert(table).values({ id: nanoid(), ...data, isAdmin });

  revalidateTag("public-notes"); // or "blogs"
  revalidatePath("/affected-path");
  return { success: true };
}
```

### Cached Queries Pattern (All Reads)

```typescript
// lib/queries/[feature].ts
import { withCache } from "@/lib/cache";

export const getData = withCache(
  async () => {
    /* db query */
  },
  ["cacheKey"],
  { tags: ["public-notes"] }, // Invalidated by actions
);
```

### Component Structure

- **Server Components** (default): Data fetching, auth checks
- **Client Components** (`"use client"`): Forms, interactivity, `useState`/`useEffect`
- Use `<Suspense fallback={<Skeleton />}>` for async server components

## File Organization

| Path                    | Purpose                                         |
| ----------------------- | ----------------------------------------------- |
| `lib/actions/*.ts`      | Server actions (writes) - always `"use server"` |
| `lib/queries/*.ts`      | Cached queries (reads) - use `withCache()`      |
| `components/[feature]/` | Feature-specific components                     |
| `components/ui/`        | Base UI (shadcn-style)                          |
| `components/shared/`    | Cross-feature components                        |
| `db/schema.ts`          | Drizzle schema + type exports                   |

## Key Conventions

1. **IDs**: Use `nanoid()` for all primary keys
2. **Soft deletes**: Set `isDeleted: true`, never hard delete
3. **Cache tags**: `"public-notes"` for notes/comments, `"blogs"` for blog posts
4. **Admin protection**: Use `requireAdmin()` from `lib/auth-helper.ts` or check layout
5. **Colors**: Notes/comments have `color` field (hex) for accent styling
6. **Markdown**: Content supports markdown via `react-markdown`

## Database Schema (Drizzle)

Core tables: `notes`, `comments`, `blogPosts`, `reactions` (all have `isAdmin`, `isDeleted`, `createdAt`)

```typescript
// After schema changes:
npm run db:push
```

## Common Tasks

**Add admin-only action**: Wrap with `await requireAdmin()` at start

**Add new query**: Use `withCache()` wrapper, add appropriate tag

**Invalidate after mutation**: Call `revalidateTag()` + `revalidatePath()` for affected routes

**Add UI component**: Check if shadcn has it first: `pnpm dlx shadcn@latest add <component>`

## Styling

- Catppuccin Mocha theme (see `globals.css` for CSS variables)
- Use semantic colors: `text-text`, `bg-base`, `text-subtext0`, `border-overlay0`
- Accent colors: `blue`, `mauve`, `pink`, `peach`, `green`, `red`
- Cards get dynamic border color from entity's `color` field

## Don't

- Don't use `fetch()` for internal data - use server actions or queries
- Don't expose admin routes without `requireAdmin()` check
- Don't forget `revalidateTag()` after database mutations
- Don't use complex animations (keep to `hover:` states)
