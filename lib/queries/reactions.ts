import { db } from "../../db/drizzle";
import { reactions } from "../../db/schema";
import { eq, sql } from "drizzle-orm";
import { withCache } from "@/lib/cache";

/**
 * Get reaction counts for a note
 */
export const getNoteReactionCounts = withCache(
  async (noteId: string) => {
    const result = await db
      .select({
        regularCount: sql<number>`count(*) filter (where ${reactions.isAdmin} = false)`,
        adminCount: sql<number>`count(*) filter (where ${reactions.isAdmin} = true)`,
      })
      .from(reactions)
      .where(eq(reactions.noteId, noteId));

    return {
      regular: Number(result[0]?.regularCount || 0),
      admin: Number(result[0]?.adminCount || 0),
    };
  },
  ["getNoteReactionCounts"],
  { tags: ["public-notes"] }
);

/**
 * Get reaction counts for a comment
 */
export const getCommentReactionCounts = withCache(
  async (commentId: string) => {
    const result = await db
      .select({
        regularCount: sql<number>`count(*) filter (where ${reactions.isAdmin} = false)`,
        adminCount: sql<number>`count(*) filter (where ${reactions.isAdmin} = true)`,
      })
      .from(reactions)
      .where(eq(reactions.commentId, commentId));

    return {
      regular: Number(result[0]?.regularCount || 0),
      admin: Number(result[0]?.adminCount || 0),
    };
  },
  ["getCommentReactionCounts"],
  { tags: ["public-notes"] }
);

/**
 * Get reaction counts for a blog post
 */
export const getBlogPostReactionCounts = withCache(
  async (blogPostId: string) => {
    const result = await db
      .select({
        regularCount: sql<number>`count(*) filter (where ${reactions.isAdmin} = false)`,
        adminCount: sql<number>`count(*) filter (where ${reactions.isAdmin} = true)`,
      })
      .from(reactions)
      .where(eq(reactions.blogPostId, blogPostId));

    return {
      regular: Number(result[0]?.regularCount || 0),
      admin: Number(result[0]?.adminCount || 0),
    };
  },
  ["getBlogPostReactionCounts"],
  { tags: ["blogs"] }
);

/**
 * Get all reactions for a note (detailed list)
 */
export const getNoteReactions = withCache(
  async (noteId: string) => {
    return await db.select().from(reactions).where(eq(reactions.noteId, noteId));
  },
  ["getNoteReactions"],
  { tags: ["public-notes"] }
);

/**
 * Get all reactions for a comment (detailed list)
 */
export const getCommentReactions = withCache(
  async (commentId: string) => {
    return await db
      .select()
      .from(reactions)
      .where(eq(reactions.commentId, commentId));
  },
  ["getCommentReactions"],
  { tags: ["public-notes"] }
);

/**
 * Get all reactions for a blog post (detailed list)
 */
export const getBlogPostReactions = withCache(
  async (blogPostId: string) => {
    return await db
      .select()
      .from(reactions)
      .where(eq(reactions.blogPostId, blogPostId));
  },
  ["getBlogPostReactions"],
  { tags: ["blogs"] }
);
