---
description: database operations with drizzle (generate, push, studio)
---

// turbo-all

## Generate Migration

After changing `lib/db/schema.ts`, generate a migration:

```bash
pnpm db:generate
```

## Push to Database

Apply migrations to your Neon database:

```bash
pnpm db:push
```

## Open Drizzle Studio

View and edit database contents in browser:

```bash
pnpm db:studio
```

## Full Reset (Development Only)

Drop all tables and re-push schema:

```bash
pnpm db:push --force
```
