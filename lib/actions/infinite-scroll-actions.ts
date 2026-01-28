"use server";

import { getPublicNotesPaginated } from "@/lib/queries/notes";
import { getPublishedBlogPostsPaginated } from "@/lib/queries/blog";
import {
  getCommentsWithReactions,
  getBlogCommentsWithReactions,
} from "@/lib/queries/comments";
import type { FilterType } from "@/components/notes/note-filter";

type SortType =
  | "default"
  | "most-comments"
  | "least-comments"
  | "most-likes"
  | "least-likes"
  | "newest"
  | "oldest";

export interface NoteWithMeta {
  id: string;
  title: string | null;
  content: string;
  userName: string | null;
  isAdmin: boolean;
  isPinned: boolean;
  isPrivate: boolean;
  isDeleted: boolean;
  imageUrl: string | null;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  reactions?: {
    regular: number;
    admin: number;
  };
  commentCount?: number;
}

export interface FetchNotesResult {
  items: NoteWithMeta[];
  nextCursor: string | null;
  hasMore: boolean;
}

/**
 * Fetch notes for infinite scroll
 * Uses page-based cursor (page number as string)
 */
export async function fetchNotesInfinite(
  cursor: string | null,
  filter: FilterType = "all",
  sort: SortType = "default",
  limit: number = 9,
): Promise<FetchNotesResult> {
  const page = cursor ? parseInt(cursor, 10) : 1;

  const { notes, totalPages } = await getPublicNotesPaginated(
    page,
    limit,
    filter,
    sort,
  );

  // Fetch comment counts in parallel for all notes
  const notesWithComments = await Promise.all(
    notes.map(async (note) => {
      const comments = await getCommentsWithReactions(note.id);
      return {
        ...note,
        commentCount: comments.length,
      };
    }),
  );

  const hasMore = page < totalPages;
  const nextCursor = hasMore ? String(page + 1) : null;

  return {
    items: notesWithComments,
    nextCursor,
    hasMore,
  };
}

// ============================================================================
// Blog Infinite Scroll
// ============================================================================

export interface BlogPostWithMeta {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  color: string;
  isPublished: boolean;
  isPinned: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  reactions?: {
    regular: number;
    admin: number;
  };
  commentCount?: number;
}

export interface FetchBlogPostsResult {
  items: BlogPostWithMeta[];
  nextCursor: string | null;
  hasMore: boolean;
}

/**
 * Fetch blog posts for infinite scroll
 * Uses page-based cursor (page number as string)
 */
export async function fetchBlogPostsInfinite(
  cursor: string | null,
  limit: number = 6,
): Promise<FetchBlogPostsResult> {
  const page = cursor ? parseInt(cursor, 10) : 1;

  const { posts, totalPages } = await getPublishedBlogPostsPaginated(
    page,
    limit,
  );

  // Fetch comment counts in parallel for all posts
  const postsWithComments = await Promise.all(
    posts.map(async (post) => {
      const comments = await getBlogCommentsWithReactions(post.id);
      return {
        ...post,
        commentCount: comments.length,
      };
    }),
  );

  const hasMore = page < totalPages;
  const nextCursor = hasMore ? String(page + 1) : null;

  return {
    items: postsWithComments,
    nextCursor,
    hasMore,
  };
}
