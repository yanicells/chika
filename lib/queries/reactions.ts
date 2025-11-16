// lib/queries/reactions.ts
import { db } from "../../db/drizzle";
import { reactions } from "../../db/schema";
import { eq, and, sql } from "drizzle-orm";

/**
 * Get reaction counts for a note
 */
export async function getNoteReactionCounts(noteId: string) {
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
}

/**
 * Get reaction counts for a comment
 */
export async function getCommentReactionCounts(commentId: string) {
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
}

/**
 * Get reaction counts for a blog post
 */
export async function getBlogPostReactionCounts(blogPostId: string) {
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
}

/**
 * Get all reactions for a note (detailed list)
 */
export async function getNoteReactions(noteId: string) {
  return await db.select().from(reactions).where(eq(reactions.noteId, noteId));
}

/**
 * Get all reactions for a comment (detailed list)
 */
export async function getCommentReactions(commentId: string) {
  return await db
    .select()
    .from(reactions)
    .where(eq(reactions.commentId, commentId));
}

/**
 * Get all reactions for a blog post (detailed list)
 */
export async function getBlogPostReactions(blogPostId: string) {
  return await db
    .select()
    .from(reactions)
    .where(eq(reactions.blogPostId, blogPostId));
}
