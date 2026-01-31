# Chika - Codebase Context

## Overview

**Chika** is an anonymous notes and personal blog application inspired by NGL (an anonymous messaging platform). It allows users to send notes that can be either public or private, with optional anonymity. The application includes a personal blog section, reaction system, comments, and a word cloud visualization of public content.

The project is built with **Next.js 16** using the App Router, **React 19**, **TypeScript**, and **TailwindCSS** with the **Catppuccin Mocha** color theme. It uses **Neon** (serverless PostgreSQL) as the database, **Drizzle ORM** for database operations, **Better Auth** for GitHub OAuth authentication, and **Uploadthing** for image uploads.

The application has two main user types:
1. **Public Users**: Can view public notes/blogs, send notes, and comment on public content
2. **Admin**: Can access private notes, manage all content (CRUD operations), create blog posts, and has special badges on their content

## Quick Start

- **Primary Language**: TypeScript
- **Framework**: Next.js 16 (App Router) + React 19
- **Entry Point**: `app/layout.tsx` → `app/page.tsx`
- **Build Command**: `npm run build`
- **Run Command**: `npm run dev`
- **Database Commands**: 
  - `npm run db:push` - Push schema changes
  - `npm run db:studio` - Open Drizzle Studio

### Environment Variables Required

```env
BETTER_AUTH_SECRET=your_better_auth_secret_here
BETTER_AUTH_URL=http://localhost:3000 
DATABASE_URL=your_neon_database_url_here
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
UPLOADTHING_TOKEN=your_uploadthing_token_here
```

## Project Structure

### Directory Layout

```
chika/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with navbar, fonts, analytics
│   ├── page.tsx                 # Homepage with hero, notes feed, blog feed
│   ├── globals.css              # Global styles with Catppuccin theme
│   ├── (admin)/                 # Admin route group (protected)
│   │   └── admin/
│   │       ├── layout.tsx       # Admin layout with sidebar nav
│   │       ├── page.tsx         # Admin dashboard with stats
│   │       ├── blog/            # Blog management pages
│   │       └── notes/           # Private notes management
│   ├── (app)/                   # Public app route group
│   │   ├── blog/                # Public blog pages
│   │   │   ├── page.tsx         # Blog listing
│   │   │   └── [slug]/          # Dynamic blog post page
│   │   ├── create/              # Note creation page
│   │   └── notes/               # Public notes pages
│   │       ├── page.tsx         # Notes listing with filters
│   │       └── [id]/            # Dynamic note detail page
│   ├── api/                     # API routes
│   │   ├── auth/[...all]/       # Better Auth catch-all route
│   │   └── uploadthing/         # Uploadthing file upload routes
│   ├── login/                   # GitHub OAuth login page
│   └── unauthorized/            # Unauthorized access page
├── components/                   # React components
│   ├── Home.tsx                 # Wrapper for Navbar
│   ├── LoginForm.tsx            # GitHub OAuth login button
│   ├── admin/                   # Admin-specific components
│   ├── blog/                    # Blog components (cards, forms, lists)
│   ├── comments/                # Comment components
│   ├── notes/                   # Note components (cards, forms, filters)
│   ├── reactions/               # Reaction system components
│   ├── shared/                  # Shared components (hero, container, etc.)
│   └── ui/                      # Base UI components (button, input, etc.)
├── db/                          # Database layer
│   ├── drizzle.ts               # Drizzle client initialization
│   └── schema.ts                # Database schema definitions
├── hooks/                       # Custom React hooks
│   └── use-infinite-scroll.ts   # Infinite scroll hook
├── lib/                         # Core utilities and logic
│   ├── auth.ts                  # Better Auth configuration
│   ├── auth-helper.ts           # Auth utility functions
│   ├── cache.ts                 # Next.js cache wrapper
│   ├── utils.ts                 # General utilities (cn function)
│   ├── actions/                 # Server Actions
│   │   ├── auth-actions.ts      # Auth actions (sign in/out)
│   │   ├── blog-actions.ts      # Blog CRUD actions
│   │   ├── comments-actions.ts  # Comment CRUD actions
│   │   ├── notes-actions.ts     # Note CRUD actions
│   │   ├── reactions-actions.ts # Reaction actions
│   │   └── infinite-scroll-actions.ts # Pagination actions
│   └── queries/                 # Data fetching functions
│       ├── blog.ts              # Blog queries
│       ├── comments.ts          # Comment queries
│       ├── notes.ts             # Note queries
│       ├── reactions.ts         # Reaction queries
│       └── wordcloud.ts         # Word cloud data generation
├── public/                      # Static assets
├── drizzle.config.ts            # Drizzle Kit configuration
├── next.config.ts               # Next.js configuration
├── package.json                 # Project dependencies
└── tsconfig.json                # TypeScript configuration
```

### Key Directories Explained

- **`app/`**: Next.js App Router pages using file-based routing. Uses route groups `(admin)` and `(app)` for layout separation.
- **`components/`**: Reusable React components organized by feature domain (notes, blog, comments, reactions) and shared UI.
- **`db/`**: Database configuration and schema using Drizzle ORM.
- **`lib/`**: Core application logic including authentication, server actions, and database queries.
- **`lib/actions/`**: Server Actions for data mutations (marked with `"use server"`).
- **`lib/queries/`**: Server-side data fetching functions wrapped with caching.
- **`hooks/`**: Custom React hooks for client-side logic.

## Architecture

### Design Pattern

The application follows a **Server-First Architecture** using Next.js App Router:

1. **Server Components**: Pages and data-fetching components render on the server
2. **Server Actions**: All data mutations happen through server actions (`"use server"`)
3. **Client Components**: Interactive UI elements marked with `"use client"`
4. **Separation of Concerns**:
   - `lib/queries/` - Read operations (SELECT)
   - `lib/actions/` - Write operations (INSERT/UPDATE/DELETE)
   - `components/` - Presentation layer

### Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Root Layout                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                      Navbar                              │    │
│  └─────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   Page Content                           │    │
│  │  ┌─────────────────┐  ┌─────────────────────────────┐   │    │
│  │  │   (admin)       │  │          (app)               │   │    │
│  │  │   Route Group   │  │       Route Group            │   │    │
│  │  │                 │  │                              │   │    │
│  │  │  ┌───────────┐  │  │  ┌────────┐ ┌───────────┐   │   │    │
│  │  │  │ AdminNav  │  │  │  │ /notes │ │   /blog   │   │   │    │
│  │  │  └───────────┘  │  │  └────────┘ └───────────┘   │   │    │
│  │  │  ┌───────────┐  │  │  ┌────────────────────┐     │   │    │
│  │  │  │ Dashboard │  │  │  │ NoteCard/BlogCard  │     │   │    │
│  │  │  │ Blog Mgmt │  │  │  │ CommentList        │     │   │    │
│  │  │  │ Note Mgmt │  │  │  │ ReactionButton     │     │   │    │
│  │  │  └───────────┘  │  │  └────────────────────┘     │   │    │
│  │  └─────────────────┘  └─────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │               FloatingCreateButton                       │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Diagram

```
┌──────────────────┐
│   Client/Browser │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│                    Next.js App Router                         │
│  ┌────────────────────┐    ┌──────────────────────────────┐  │
│  │   Server Actions   │◄───│      React Components        │  │
│  │   (lib/actions/)   │    │   (Server & Client)          │  │
│  └─────────┬──────────┘    └──────────────────────────────┘  │
│            │                           │                      │
│            ▼                           ▼                      │
│  ┌────────────────────┐    ┌──────────────────────────────┐  │
│  │     Drizzle ORM    │    │     Cached Queries           │  │
│  │    (db/drizzle)    │    │    (lib/queries/)            │  │
│  └─────────┬──────────┘    └─────────────┬────────────────┘  │
│            │                             │                    │
│            └────────────┬────────────────┘                    │
│                         ▼                                     │
│            ┌────────────────────────┐                         │
│            │   Neon PostgreSQL      │                         │
│            │   (Serverless)         │                         │
│            └────────────────────────┘                         │
└──────────────────────────────────────────────────────────────┘
```

### Core Components

#### Notes System
- **Location**: `components/notes/`, `lib/actions/notes-actions.ts`, `lib/queries/notes.ts`
- **Purpose**: Core note functionality (create, view, edit, delete, filter, sort)
- **Key Files**:
  - [note-form.tsx](components/notes/note-form.tsx) - Note creation form
  - [note-card.tsx](components/notes/note-card.tsx) - Note display card
  - [filtered-note-list.tsx](components/notes/filtered-note-list.tsx) - Notes grid with filtering/sorting
  - [note-detail.tsx](components/notes/note-detail.tsx) - Full note view
- **Dependencies**: Drizzle ORM, nanoid, Uploadthing
- **Used By**: Home page, Notes page, Admin notes page

#### Blog System
- **Location**: `components/blog/`, `lib/actions/blog-actions.ts`, `lib/queries/blog.ts`
- **Purpose**: Personal blog with markdown support
- **Key Files**:
  - [blog-form.tsx](components/blog/blog-form.tsx) - Blog creation/editing form
  - [blog-card.tsx](components/blog/blog-card.tsx) - Blog post card
  - [blog-detail.tsx](components/blog/blog-detail.tsx) - Full blog post view
  - [infinite-blog-list.tsx](components/blog/infinite-blog-list.tsx) - Blog grid with infinite scroll
- **Dependencies**: react-markdown, nanoid
- **Used By**: Home page, Blog page, Admin blog management

#### Comments System
- **Location**: `components/comments/`, `lib/actions/comments-actions.ts`, `lib/queries/comments.ts`
- **Purpose**: Comments on notes and blog posts
- **Key Files**:
  - [comment-form.tsx](components/comments/comment-form.tsx) - Comment submission form
  - [comment-list.tsx](components/comments/comment-list.tsx) - Comment display list
  - [comment-card.tsx](components/comments/comment-card.tsx) - Individual comment card
- **Dependencies**: Notes system, Blog system
- **Used By**: Note detail page, Blog post page

#### Reactions System
- **Location**: `components/reactions/`, `lib/actions/reactions-actions.ts`, `lib/queries/reactions.ts`
- **Purpose**: Heart reaction system for notes, comments, and blog posts
- **Key Files**:
  - [reaction-button.tsx](components/reactions/reaction-button.tsx) - Interactive reaction button
  - [reaction-display.tsx](components/reactions/reaction-display.tsx) - Reaction count display
- **Features**: Tracks admin vs regular user reactions separately
- **Used By**: Note cards, Comment cards, Blog cards

#### Authentication System
- **Location**: `lib/auth.ts`, `lib/auth-helper.ts`, `lib/actions/auth-actions.ts`
- **Purpose**: GitHub OAuth authentication with role-based access
- **Key Files**:
  - [auth.ts](lib/auth.ts) - Better Auth configuration
  - [auth-helper.ts](lib/auth-helper.ts) - Helper functions (requireAdmin, isAdmin, getCurrentSession)
  - [auth-actions.ts](lib/actions/auth-actions.ts) - Sign in/out server actions
- **Used By**: Admin routes, all components that need auth state

## Data Flow

### Request/Response Cycle (Creating a Note)

1. **User submits form** in [note-form.tsx](components/notes/note-form.tsx)
2. **Client calls** `createNote()` server action from [notes-actions.ts](lib/actions/notes-actions.ts)
3. **Server action**:
   - Gets current session via `getCurrentSession()`
   - Generates unique ID with `nanoid()`
   - Inserts note into database via Drizzle
   - Calls `revalidateTag()` and `revalidatePath()` to invalidate cache
4. **Client receives** success response
5. **Router redirects** to `/notes` page
6. **Notes page** fetches fresh data (cache was invalidated)

### Authentication Flow

```
User clicks "Login with GitHub"
         │
         ▼
signInSocial("github") - lib/actions/auth-actions.ts
         │
         ▼
Better Auth generates OAuth URL
         │
         ▼
Redirect to GitHub OAuth
         │
         ▼
GitHub redirects back to /api/auth/[...all]
         │
         ▼
Better Auth handles callback, creates session
         │
         ▼
User redirected to /notes with session cookie
```

### State Management

- **Server State**: Managed through Next.js caching (`unstable_cache`) with tag-based invalidation
- **Client State**: Minimal, using React's `useState` for form inputs and UI state
- **Session State**: Managed by Better Auth with HTTP-only cookies
- **Cache Tags Used**:
  - `public-notes` - All note-related queries
  - `blogs` - All blog-related queries
  - `word-cloud` - Word cloud generation

## Key Files Reference

### Configuration Files

- **[package.json](package.json)**: Project dependencies and npm scripts
- **[drizzle.config.ts](drizzle.config.ts)**: Drizzle Kit config for migrations
- **[next.config.ts](next.config.ts)**: Next.js configuration
- **[tsconfig.json](tsconfig.json)**: TypeScript configuration
- **[components.json](components.json)**: shadcn/ui configuration
- **[globals.css](app/globals.css)**: Catppuccin Mocha theme variables

### Entry Points

- **[app/layout.tsx](app/layout.tsx)**: Root layout with fonts, navbar, floating button, analytics
- **[app/page.tsx](app/page.tsx)**: Homepage with hero section, notes feed, blog feed
- **[lib/auth.ts](lib/auth.ts)**: Authentication configuration entry point
- **[db/drizzle.ts](db/drizzle.ts)**: Database client initialization

### Critical Business Logic

- **[lib/auth-helper.ts](lib/auth-helper.ts)**: Admin protection and session helpers
- **[lib/cache.ts](lib/cache.ts)**: Query caching wrapper with tag support
- **[lib/queries/wordcloud.ts](lib/queries/wordcloud.ts)**: Word cloud generation algorithm
- **[hooks/use-infinite-scroll.ts](hooks/use-infinite-scroll.ts)**: Infinite scroll with deduplication

## Database Schema

### Tables

#### `user` (Better Auth)
| Field | Type | Description |
|-------|------|-------------|
| id | text | Primary key |
| name | text | User's display name |
| email | text | Unique email address |
| emailVerified | boolean | Email verification status |
| image | text | Profile image URL |
| role | text | User role (`user` or `admin`) |
| createdAt | timestamp | Account creation time |
| updatedAt | timestamp | Last update time |

#### `session` (Better Auth)
| Field | Type | Description |
|-------|------|-------------|
| id | text | Primary key |
| token | text | Session token |
| expiresAt | timestamp | Expiration time |
| userId | text | FK → user.id |

#### `account` (Better Auth)
| Field | Type | Description |
|-------|------|-------------|
| id | text | Primary key |
| providerId | text | OAuth provider (github) |
| accountId | text | Provider's user ID |
| userId | text | FK → user.id |

#### `notes`
| Field | Type | Description |
|-------|------|-------------|
| id | text | Primary key (nanoid) |
| title | text | Optional note title |
| content | text | Note body (markdown) |
| userName | text | Optional sender name |
| isAdmin | boolean | Created by admin? |
| imageUrl | text | Optional image URL |
| color | text | Border/accent color hex |
| isPrivate | boolean | Private note flag |
| isPinned | boolean | Pinned to top |
| isDeleted | boolean | Soft delete flag |
| createdAt | timestamp | Creation time |
| updatedAt | timestamp | Last update time |

#### `comments`
| Field | Type | Description |
|-------|------|-------------|
| id | text | Primary key (nanoid) |
| noteId | text | FK → notes.id (nullable) |
| blogPostId | text | FK → blogPosts.id (nullable) |
| userName | text | Optional commenter name |
| isAdmin | boolean | Comment by admin? |
| content | text | Comment body |
| imageUrl | text | Optional image URL |
| color | text | Accent color hex |
| isPrivate | boolean | Private comment flag |
| isDeleted | boolean | Soft delete flag |
| createdAt | timestamp | Creation time |

#### `blogPosts`
| Field | Type | Description |
|-------|------|-------------|
| id | text | Primary key (nanoid) |
| title | text | Post title |
| slug | text | URL slug (unique) |
| content | text | Post body (markdown) |
| excerpt | text | Optional summary |
| coverImageUrl | text | Optional cover image |
| color | text | Accent color hex |
| isPublished | boolean | Published status |
| isPinned | boolean | Pinned to top |
| isDeleted | boolean | Soft delete flag |
| createdAt | timestamp | Creation time |
| updatedAt | timestamp | Last update time |
| publishedAt | timestamp | Publish time |

#### `reactions`
| Field | Type | Description |
|-------|------|-------------|
| id | text | Primary key (nanoid) |
| noteId | text | FK → notes.id (nullable) |
| commentId | text | FK → comments.id (nullable) |
| blogPostId | text | FK → blogPosts.id (nullable) |
| isAdmin | boolean | Reaction by admin? |
| createdAt | timestamp | Reaction time |

### Relationships

```
user ─────┬──── session (1:N)
          └──── account (1:N)

notes ────┬──── comments (1:N)
          └──── reactions (1:N)

blogPosts ┬──── comments (1:N)
          └──── reactions (1:N)

comments ─┴──── reactions (1:N)
```

### Type Exports

```typescript
// Available from db/schema.ts
export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type Reaction = typeof reactions.$inferSelect;
```

## API Reference

### Auth Endpoints (Better Auth)

All auth handled by Better Auth at `/api/auth/[...all]`:
- **GET/POST** `/api/auth/*` - Better Auth catch-all handler

### Uploadthing Endpoints

- **POST** `/api/uploadthing` - Image upload endpoint
  - Max file size: 4MB
  - Max file count: 1
  - Returns: `{ url: string }`

### Server Actions

#### Notes Actions (`lib/actions/notes-actions.ts`)

| Action | Access | Description |
|--------|--------|-------------|
| `createNote(data)` | Public | Create a new note |
| `updateNote(id, data)` | Admin | Update a note |
| `deleteNote(id)` | Admin | Soft delete a note |
| `togglePinNote(id)` | Admin | Toggle pin status |

#### Blog Actions (`lib/actions/blog-actions.ts`)

| Action | Access | Description |
|--------|--------|-------------|
| `createBlogPost(data)` | Admin | Create a blog post |
| `updateBlogPost(id, data)` | Admin | Update a blog post |
| `deleteBlogPost(id)` | Admin | Soft delete a blog post |
| `togglePinBlogPost(id)` | Admin | Toggle pin status |

#### Comments Actions (`lib/actions/comments-actions.ts`)

| Action | Access | Description |
|--------|--------|-------------|
| `createNoteComment(data)` | Public | Comment on a note |
| `createBlogComment(data)` | Public | Comment on a blog post |
| `updateComment(id, data)` | Admin | Update a comment |
| `deleteComment(id)` | Admin | Soft delete a comment |

#### Reactions Actions (`lib/actions/reactions-actions.ts`)

| Action | Access | Description |
|--------|--------|-------------|
| `addNoteReaction(noteId)` | Public | Add reaction to note |
| `removeNoteReaction(noteId)` | Public | Remove reaction from note |
| `addCommentReaction(commentId)` | Public | Add reaction to comment |
| `removeCommentReaction(commentId)` | Public | Remove reaction |
| `addBlogPostReaction(postId)` | Public | Add reaction to blog post |
| `removeBlogPostReaction(postId)` | Public | Remove reaction |

## Module Dependency Map

### Import Relationships

```
app/
├── layout.tsx
│   └── imports: Home, FloatingCreateButton, Analytics
│
├── page.tsx
│   └── imports: HeroSection, NoteList, BlogList, queries/notes, queries/blog
│
├── (admin)/admin/
│   ├── layout.tsx
│   │   └── imports: auth-helper (requireAdmin), AdminNav
│   └── page.tsx
│       └── imports: queries/notes, queries/blog

lib/
├── auth.ts
│   └── imports: better-auth, db/drizzle, db/schema
│
├── auth-helper.ts
│   └── imports: auth.ts
│
├── actions/*
│   └── imports: db/drizzle, db/schema, auth-helper, cache

db/
├── drizzle.ts
│   └── imports: drizzle-orm/neon-http, schema
│
└── schema.ts
    └── imports: drizzle-orm/pg-core, drizzle-orm (relations)

components/
├── notes/*
│   └── imports: ui/*, actions/notes-actions, schema types
│
├── blog/*
│   └── imports: ui/*, actions/blog-actions, schema types
│
└── comments/*
    └── imports: ui/*, actions/comments-actions
```

### Third-Party Dependencies

| Package | Purpose | Used In |
|---------|---------|---------|
| `better-auth` | GitHub OAuth authentication | lib/auth.ts, auth-helper.ts |
| `drizzle-orm` | Type-safe database ORM | db/*, lib/queries/*, lib/actions/* |
| `@neondatabase/serverless` | Serverless Postgres | db/drizzle.ts |
| `nanoid` | Generate unique IDs | lib/actions/* |
| `react-markdown` | Render markdown content | note-detail, blog-detail |
| `uploadthing` | File uploads | api/uploadthing, image-upload.tsx |
| `@isoterik/react-word-cloud` | Word cloud visualization | word-cloud-display.tsx |
| `@vercel/analytics` | Usage analytics | app/layout.tsx |
| `lucide-react` | Icons | Various UI components |
| `@radix-ui/*` | Accessible UI primitives | ui/dropdown-menu, checkbox, tooltip |
| `clsx` + `tailwind-merge` | Class name utilities | lib/utils.ts |

## Common Operations

### How to Add a New Feature

1. **Database changes** (if needed):
   - Update [db/schema.ts](db/schema.ts) with new tables/columns
   - Run `npm run db:push` to update the database
   - Export types at the bottom of schema.ts

2. **Create queries** in `lib/queries/`:
   - Wrap with `withCache()` for caching
   - Use appropriate cache tags

3. **Create server actions** in `lib/actions/`:
   - Add `"use server"` directive
   - Call `revalidateTag()` after mutations

4. **Create components** in `components/`:
   - Server components for data fetching
   - Client components (`"use client"`) for interactivity

5. **Add pages** in `app/`:
   - Use Suspense for loading states
   - Pass data from server to client components

### How to Add a New Admin Page

1. Create page in `app/(admin)/admin/your-page/page.tsx`
2. The parent layout already calls `requireAdmin()` - you're protected
3. Add navigation link in [admin-nav.tsx](components/admin/admin-nav.tsx)

### How to Add a New Public Page

1. Create page in `app/(app)/your-page/page.tsx`
2. Fetch data using queries from `lib/queries/`
3. Check admin status with `isAdmin()` if needed for edit buttons

### How to Create a New Server Action

```typescript
// lib/actions/your-actions.ts
"use server";

import { db } from "@/db/drizzle";
import { yourTable } from "@/db/schema";
import { revalidateTag, revalidatePath } from "next/cache";
import { requireAdmin, getCurrentSession } from "@/lib/auth-helper";

export async function createYourThing(data: YourData) {
  try {
    // For admin-only actions:
    await requireAdmin();
    
    // Or for public actions with admin detection:
    const session = await getCurrentSession();
    const isAdmin = session?.user?.role === "admin";

    await db.insert(yourTable).values({
      id: nanoid(),
      ...data,
      isAdmin,
    });

    // Invalidate cache
    revalidateTag("your-cache-tag");
    revalidatePath("/your-path");

    return { success: true };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, error: "Failed to create" };
  }
}
```

## Testing

### Test Structure

Currently no automated tests are set up. Consider adding:
- **Unit Tests**: Jest/Vitest for utility functions
- **Integration Tests**: Testing Library for components
- **E2E Tests**: Playwright/Cypress for user flows

### Manual Testing Checklist

- [ ] Create note (public/private, with/without name)
- [ ] View public notes, apply filters and sorting
- [ ] View note detail, add comment
- [ ] Add/remove reactions
- [ ] Admin login via GitHub
- [ ] Admin dashboard stats
- [ ] Admin: create/edit/delete blog post
- [ ] Admin: view private notes
- [ ] Admin: pin/unpin content
- [ ] Image upload in notes/comments/blogs
- [ ] Word cloud renders on homepage
- [ ] Infinite scroll loads more content
- [ ] Responsive design on mobile

## Build & Deployment

### Build Process

```bash
npm run build
# 1. TypeScript compilation
# 2. Next.js static generation where possible
# 3. Optimizes images and bundles
```

### Deployment (Vercel Recommended)

1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Yes | Random secret for auth |
| `BETTER_AUTH_URL` | Yes | App URL (e.g., `https://your-app.vercel.app`) |
| `GITHUB_CLIENT_ID` | Yes | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | Yes | GitHub OAuth app secret |
| `UPLOADTHING_TOKEN` | Yes | Uploadthing API token |

## Security & Authentication

### Authentication Flow

1. User clicks "Login with GitHub" on `/login`
2. Better Auth redirects to GitHub OAuth
3. GitHub authenticates and redirects back
4. Better Auth creates session and sets HTTP-only cookie
5. User redirected to `/notes` with active session

### Authorization

- **Public**: Can view public content, create notes/comments
- **Admin**: Full CRUD access, managed by `role` field in user table
- Route protection via `requireAdmin()` in admin layout

### Admin Access

To make a user admin, manually update the database:
```sql
UPDATE "user" SET role = 'admin' WHERE email = 'your-email@example.com';
```

### Sensitive Data

- Session tokens stored in HTTP-only cookies (managed by Better Auth)
- Database credentials only in environment variables
- GitHub OAuth secrets only in environment variables
- No client-side exposure of secrets

## Error Handling

### Error Patterns

1. **Server Actions**: Return `{ success: boolean, error?: string }`
2. **Components**: Use try/catch and display error state
3. **Auth Errors**: Redirect to home or unauthorized page

### Logging

- Console logging for errors in server actions
- No structured logging system currently

## Development Guidelines

### Code Conventions

1. **File Naming**: kebab-case for files (`note-card.tsx`)
2. **Component Naming**: PascalCase (`NoteCard`)
3. **Server Actions**: camelCase functions (`createNote`)
4. **Types**: PascalCase for types, suffix with `Props` for component props

### Common Patterns

1. **Server Component with Data**:
   ```tsx
   export default async function Page() {
     const data = await getYourData();
     return <YourComponent data={data} />;
   }
   ```

2. **Client Component with Action**:
   ```tsx
   "use client";
   const [isLoading, setIsLoading] = useState(false);
   const handleSubmit = async () => {
     setIsLoading(true);
     const result = await serverAction(data);
     setIsLoading(false);
   };
   ```

3. **Protected Route**: Admin layout handles protection

### Anti-Patterns to Avoid

- Don't fetch data in client components (use server components or actions)
- Don't expose database IDs in URLs without validation
- Don't forget `revalidateTag` after mutations
- Don't use inline styles (use Tailwind classes)

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Auth not working | Check `BETTER_AUTH_URL` matches your domain |
| Database connection fails | Verify `DATABASE_URL` is correct and Neon is running |
| Images not uploading | Check `UPLOADTHING_TOKEN` is valid |
| Stale data after mutation | Ensure `revalidateTag` is called in server action |
| Admin routes accessible | Check `requireAdmin()` is in admin layout |
| CSS not loading | Check Catppuccin variables in `globals.css` |

### Debug Tips

1. Check browser console for client errors
2. Check terminal for server action errors
3. Use `npm run db:studio` to inspect database
4. Add `console.log` in server actions (shows in terminal)

## Performance Considerations

### Caching Strategy

- **Query Cache**: 1-hour TTL via `unstable_cache` in `lib/cache.ts`
- **Tag Invalidation**: Mutations call `revalidateTag()` to bust cache
- **Static Generation**: Homepage sections use Suspense for streaming

### Optimization Opportunities

1. Consider adding indexes on frequently queried columns
2. Implement pagination for large datasets (partially done with infinite scroll)
3. Consider using React Server Components for more components
4. Add image optimization via Next.js `<Image>` component

## Known Limitations

1. **No Nested Comments**: Comments are flat, no reply-to-reply support
2. **No User Accounts**: Only admin has an account; users are anonymous
3. **Single Admin**: Role system exists but only one admin expected
4. **No Email Auth**: Only GitHub OAuth supported
5. **No Rate Limiting**: Server actions don't have rate limiting
6. **No Search**: No full-text search for notes/blogs yet

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Better Auth Documentation](https://www.better-auth.com/)
- [Catppuccin Color Palette](https://github.com/catppuccin/catppuccin)
- [Uploadthing Documentation](https://docs.uploadthing.com/)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)

## Last Updated

**Date**: January 31, 2026

**Changes**:
- Initial comprehensive documentation
- Covers full architecture, components, database schema
- Includes development guidelines and troubleshooting
