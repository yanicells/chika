// lib/queries/comments.ts
import { db } from "../../db/drizzle";
import { comments, reactions } from "../../db/schema";
import { eq, and, desc, sql } from "drizzle-orm";

/**
 * Get all comments for a note
 * Only returns non-deleted comments
 */
export async function getCommentsByNoteId(noteId: string) {
  return await db
    .select()
    .from(comments)
    .where(and(eq(comments.noteId, noteId), eq(comments.isDeleted, false)))
    .orderBy(desc(comments.createdAt));
}

/**
 * Get single comment by ID
 */
export async function getCommentById(id: string) {
  const result = await db
    .select()
    .from(comments)
    .where(and(eq(comments.id, id), eq(comments.isDeleted, false)))
    .limit(1);

  return result[0] || null;
}

/**
 * Get comments with reaction counts for a note
 */
export async function getCommentsWithReactions(noteId: string) {
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
}

/**
 * Get total comment count for a note
 */
export async function getCommentCount(noteId: string) {
  const result = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(comments)
    .where(and(eq(comments.noteId, noteId), eq(comments.isDeleted, false)));

  return Number(result[0]?.count || 0);
}
