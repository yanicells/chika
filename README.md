# Chika - Anonymous Notes App

A web application inspired by NGL where users can send anonymous or named notes. Notes can be private (visible only to me) or public, with comment functionality for public notes. Includes admin features for managing notes and a personal blog section.

## Features

- Send notes with title, body, and optional name (anonymous or named)
- Notes can be private (admin-only) or public
- View all public notes in a feed
- Comment on public notes
- Admin dashboard for managing private notes, editing comments, deleting notes, posting blog entries
- Personal blog section for sharing learnings and thoughts
- Note reactions with curated emojis
- Color themes for notes
- Word cloud visualization from public notes
- Image uploads for notes

## Tech Stack

- **Frontend**: Next.js, React TypeScript, TailwindCSS
- **Backend**: Next.js Server Actions
- **Database**: Neon (Serverless PostgreSQL)
- **ORM**: Drizzle
- **Authentication**: Better Auth
- **File Uploads**: Uploadthing
- **Styling**: TailwindCSS with Catppuccin color scheme

## Setup Guide

### Prerequisites

- Node.js (>= 18.x)
- npm (>= 9.x)

### Clone the Repository

```bash
git clone https://github.com/yanicells/chika.git
cd chika
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory and add the following:

```env
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000 
DATABASE_URL=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
UPLOADTHING_TOKEN=
```

### Database Setup

Run the database migrations:

```bash
npm run db:push
```

### Run the Project

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Usage

1. Open the landing page at `/`
2. Send a note using the note form (choose anonymous or named, private or public)
3. Browse public notes and add comments
4. Admin login to access private notes and management features
5. Explore the blog section for personal posts
6. Use reactions and color themes to enhance notes
