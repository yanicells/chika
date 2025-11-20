import { db } from "../../db/drizzle";
import { comments, reactions } from "../../db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { withCache } from "@/lib/cache";

/**
 * Get all comments for a note
 * Only returns non-deleted comments
 */
export const getCommentsByNoteId = withCache(
  async (noteId: string) => {
    return await db
      .select()
      .from(comments)
      .where(
        and(
          eq(comments.noteId, noteId),
          eq(comments.isDeleted, false),
          eq(comments.isPrivate, false)
        )
      )
      .orderBy(desc(comments.createdAt));
  },
  ["getCommentsByNoteId"],
  { tags: ["public-notes"] }
);

/**
 * Get single comment by ID
 */
export const getCommentById = withCache(
  async (id: string) => {
    const result = await db
      .select()
      .from(comments)
      .where(and(eq(comments.id, id), eq(comments.isDeleted, false)))
      .limit(1);

    return result[0] || null;
  },
  ["getCommentById"],
  { tags: ["public-notes"] }
);

/**
 * Get comments with reaction counts for a note
 */
export const getCommentsWithReactions = withCache(
  async (noteId: string) => {
    const noteComments = await getCommentsByNoteId(noteId);

    // Get reaction counts for all comments
    const commentIds = noteComments.map((c) => c.id);

    if (commentIds.length === 0) {
      return [];
    }

    const reactionCounts = await db
      .select({
        commentId: reactions.commentId,
        regularCount: sql<number>`count(*) filter (where ${reactions.isAdmin} = false)`,
        adminCount: sql<number>`count(*) filter (where ${reactions.isAdmin} = true)`,
      })
      .from(reactions)
      .where(sql`${reactions.commentId} IN ${commentIds}`)
      .groupBy(reactions.commentId);

    // Map reactions to comments
    const reactionMap = new Map(
      reactionCounts.map((r) => [
        r.commentId,
        {
          regular: Number(r.regularCount || 0),
          admin: Number(r.adminCount || 0),
        },
      ])
    );

    return noteComments.map((comment) => ({
      ...comment,
      reactions: reactionMap.get(comment.id) || { regular: 0, admin: 0 },
    }));
  },
  ["getCommentsWithReactions"],
  { tags: ["public-notes"] }
);

/**
 * Get total comment count for a note
 */
export const getCommentCount = withCache(
  async (noteId: string) => {
    const result = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(comments)
      .where(and(eq(comments.noteId, noteId), eq(comments.isDeleted, false)));

    return Number(result[0]?.count || 0);
  },
  ["getCommentCount"],
  { tags: ["public-notes"] }
);

/**
 * Get all comments for a blog post
 */
export const getCommentsByBlogPostId = withCache(
  async (blogPostId: string) => {
    return await db
      .select()
      .from(comments)
      .where(
        and(
          eq(comments.blogPostId, blogPostId),
          eq(comments.isDeleted, false),
          eq(comments.isPrivate, false)
        )
      )
      .orderBy(desc(comments.createdAt));
  },
  ["getCommentsByBlogPostId"],
  { tags: ["blogs"] }
);

/**
 * Get comments with reactions for a blog post
 */
export const getBlogCommentsWithReactions = withCache(
  async (blogPostId: string) => {
    const blogComments = await getCommentsByBlogPostId(blogPostId);

    const commentIds = blogComments.map((c) => c.id);

    if (commentIds.length === 0) {
      return [];
    }

    const reactionCounts = await db
      .select({
        commentId: reactions.commentId,
        regularCount: sql<number>`count(*) filter (where ${reactions.isAdmin} = false)`,
        adminCount: sql<number>`count(*) filter (where ${reactions.isAdmin} = true)`,
      })
      .from(reactions)
      .where(sql`${reactions.commentId} IN ${commentIds}`)
      .groupBy(reactions.commentId);

    const reactionMap = new Map(
      reactionCounts.map((r) => [
        r.commentId,
        {
          regular: Number(r.regularCount || 0),
          admin: Number(r.adminCount || 0),
        },
      ])
    );

    return blogComments.map((comment) => ({
      ...comment,
      reactions: reactionMap.get(comment.id) || { regular: 0, admin: 0 },
    }));
  },
  ["getBlogCommentsWithReactions"],
  { tags: ["blogs"] }
);

/**
 * Get total comment count for a blog post
 */
export const getBlogCommentCount = withCache(
  async (blogPostId: string) => {
    const result = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(comments)
      .where(
        and(eq(comments.blogPostId, blogPostId), eq(comments.isDeleted, false))
      );

    return Number(result[0]?.count || 0);
  },
  ["getBlogCommentCount"],
  { tags: ["blogs"] }
);

/** Get all comments for a note including private ones, admin access
 */
export const getAllCommentsByNoteId = withCache(
  async (noteId: string) => {
    return await db
      .select()
      .from(comments)
      .where(and(eq(comments.noteId, noteId), eq(comments.isDeleted, false)))
      .orderBy(desc(comments.createdAt));
  },
  ["getAllCommentsByNoteId"],
  { tags: ["public-notes"] }
);

/** Get all comments for a blog post including private ones, admin access
 */
export const getAllCommentsByBlogPostId = withCache(
  async (blogPostId: string) => {
    return await db
      .select()
      .from(comments)
      .where(
        and(eq(comments.blogPostId, blogPostId), eq(comments.isDeleted, false))
      )
      .orderBy(desc(comments.createdAt));
  },
  ["getAllCommentsByBlogPostId"],
  { tags: ["blogs"] }
);