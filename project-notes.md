# Project Plan: Anonymous Notes App

## Project Concept
This is basically just like NGL where like you can send notes. But they are only for me.

## Core Features
- Users can send notes, it can have a title, body, and either be anonymous or have their name on it.
- Most importantly it can be private (only I can see) or public.
- The app will handle sending notes. You can see all public notes.
- Then we could also have comment funcitonality for public notes. Users can comment on any notes.

## Admin Functionality
- Then you will have a private notes tab that only I can see.
- I can also create my comments, and maybe only I can update/edit it.
- Note that the auth will just be for me to access the private notes and also delete some notes.

## Tech Stack
- Basically I will use next js with react ts with this.
- I will use neon for the serverless postgres.
- I will learn better auth for this project.
- I will use drizzle for this.

## Learning Goals
I guess the main learning experience here is using neon, using schemas (since i just raw dogged postgres before), applying auth (better), and some next server actions.

## Possible Additional Features
*(if i will apply this, this would be after its deployed already, so really, just additional if ever)*

- **Note Reactions:** Allow users to react to public notes with a few curated emojis. This is a simple way to increase engagement without the commitment of a full comment.
- **Color Themes:** Let the sender pick a background color for their note from a small palette. This adds a visual, personal touch to the public feed.
- **Word Cloud:** Automatically generate and display a word cloud from the text of all public notes. This gives a fun, at-a-glance visualization of what people are talking about.
- Being able to send pictures.