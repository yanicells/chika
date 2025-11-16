
## File Structure

```bash
├── README.md
├── app
│   ├── (admin)
│   │   ├── admin
│   │   │   ├── blog
│   │   │   │   ├── create
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── edit
│   │   │   │   │   └── [id]
│   │   │   │   │       └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── notes
│   │       └── page.tsx
│   ├── (app)
│   │   ├── blog
│   │   │   ├── [slug]
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── create
│   │   │   └── page.tsx
│   │   └── notes
│   │       ├── [id]
│   │       │   └── page.tsx
│   │       └── page.tsx
│   ├── api
│   │   └── auth
│   │       └── [...all]
│   │           └── route.ts
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── login
│   │   └── page.tsx
│   ├── page.tsx
│   └── unauthorized
│       └── page.tsx
├── components
│   ├── Home.tsx
│   └── LoginForm.tsx
├── db
│   ├── drizzle.ts
│   └── schema.ts
├── drizzle.config.ts
├── eslint.config.mjs
├── lib
│   ├── actions
│   │   ├── admin-actions.ts
│   │   ├── auth-actions.ts
│   │   ├── blog-actions.ts
│   │   ├── comments-actions.ts
│   │   ├── notes-actions.ts
│   │   └── reactions-actions.ts
│   ├── auth-helper.ts
│   ├── auth.ts
│   ├── dal.ts
│   ├── queries
│   │   ├── blog.ts
│   │   ├── comments.ts
│   │   ├── notes.ts
│   │   └── reactions.ts
│   ├── types.ts
│   └── utils.ts
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── project-notes.md
├── public
└── tsconfig.json
```
