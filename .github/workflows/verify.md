---
description: verify build passes and no type errors
---

// turbo-all

1. Run type check:

```bash
pnpm typecheck
```

2. Run linter:

```bash
pnpm lint
```

3. Test production build:

```bash
pnpm build
```

If build fails, check the errors and fix them before committing.
