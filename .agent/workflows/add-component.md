---
description: add a new shadcn/ui component
---

// turbo-all

1. To add a new shadcn/ui component, run:

```bash
pnpm dlx shadcn@latest add <component-name>
```

Example components:

- `button` - Button component
- `card` - Card with header, content, footer
- `dialog` - Modal dialog
- `input` - Text input
- `select` - Dropdown select
- `table` - Data table
- `tabs` - Tab navigation
- `toast` - Toast notifications (also install `sonner`)
- `form` - Form with react-hook-form integration

2. Multiple components at once:

```bash
pnpm dlx shadcn@latest add button card dialog input
```

3. Components are installed to `components/ui/`.
