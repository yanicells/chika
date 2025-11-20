"use server";

import { db } from "../../db/drizzle";
import { reactions } from "../../db/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath, revalidateTag } from "next/cache";
import { getCurrentSession } from "../auth-helper";

const NOTE_TAG = "public-notes";
const BLOG_TAG = "blogs";

/**
 * Add a reaction to a note
 * Anyone can react, but isAdmin flag is set based on session
 */
export async function addNoteReaction(noteId: string) {
  try {
    const session = await getCurrentSession();
    const isAdmin = session?.user?.role === "admin";

    const reactionId = nanoid();

    await db.insert(reactions).values({
      id: reactionId,
      noteId,
      commentId: null,
      blogPostId: null,
      isAdmin,
      createdAt: new Date(),
    });

    revalidateTag(NOTE_TAG, 'default');
    revalidatePath(`/notes/${noteId}`);
    revalidatePath("/");
    revalidatePath("/notes");

    return { success: true, reactionId };
  } catch (error) {
    console.error("Add note reaction error:", error);
    return { success: false, error: "Failed to add reaction" };
  }
}

/**
 * Remove a reaction from a note
 * For simplicity, removes the most recent reaction
 * You might want to track reactions per user/session in the future
 */
export async function removeNoteReaction(noteId: string) {
  try {
    const session = await getCurrentSession();
    const isAdmin = session?.user?.role === "admin";

    // Find the most recent reaction by this user type (admin or regular)
    const reaction = await db.query.reactions.findFirst({
      where: and(eq(reactions.noteId, noteId), eq(reactions.isAdmin, isAdmin)),
      orderBy: (reactions, { desc }) => [desc(reactions.createdAt)],
    });

    if (!reaction) {
      return { success: false, error: "No reaction found" };
    }

    await db.delete(reactions).where(eq(reactions.id, reaction.id));

    revalidateTag(NOTE_TAG, 'default');
    revalidatePath(`/notes/${noteId}`);
    revalidatePath("/");
    revalidatePath("/notes");

    return { success: true };
  } catch (error) {
    console.error("Remove note reaction error:", error);
    return { success: false, error: "Failed to remove reaction" };
  }
}

/**
 * Add a reaction to a comment
 */
export async function addCommentReaction(commentId: string) {
  try {
    const session = await getCurrentSession();
    const isAdmin = session?.user?.role === "admin";

    const reactionId = nanoid();

    await db.insert(reactions).values({
      id: reactionId,
      noteId: null,
      commentId,
      blogPostId: null,
      isAdmin,
      createdAt: new Date(),
    });

    revalidateTag(NOTE_TAG, 'default');
    revalidateTag(BLOG_TAG, 'default');
    revalidatePath("/");
    revalidatePath("/notes");
    revalidatePath("/blog");

    return { success: true, reactionId };
  } catch (error) {
    console.error("Add comment reaction error:", error);
    return { success: false, error: "Failed to add reaction" };
  }
}

/**
 * Remove a reaction from a comment
 */
export async function removeCommentReaction(commentId: string) {
  try {
    const session = await getCurrentSession();
    const isAdmin = session?.user?.role === "admin";

    const reaction = await db.query.reactions.findFirst({
      where: and(
        eq(reactions.commentId, commentId),
        eq(reactions.isAdmin, isAdmin)
      ),
      orderBy: (reactions, { desc }) => [desc(reactions.createdAt)],
    });

    if (!reaction) {
      return { success: false, error: "No reaction found" };
    }

    await db.delete(reactions).where(eq(reactions.id, reaction.id));

    revalidateTag(NOTE_TAG, 'default');
    revalidateTag(BLOG_TAG, 'default');
    revalidatePath("/");
    revalidatePath("/notes");
    revalidatePath("/blog");

    return { success: true };
  } catch (error) {
    console.error("Remove comment reaction error:", error);
    return { success: false, error: "Failed to remove reaction" };
  }
}

/**
 * Add a reaction to a blog post
 */
export async function addBlogPostReaction(blogPostId: string) {
  try {
    const session = await getCurrentSession();
    const isAdmin = session?.user?.role === "admin";

    const reactionId = nanoid();

    await db.insert(reactions).values({
      id: reactionId,
      noteId: null,
      commentId: null,
      blogPostId,
      isAdmin,
      createdAt: new Date(),
    });

    revalidateTag(BLOG_TAG, 'default');
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${blogPostId}`);

    return { success: true, reactionId };
  } catch (error) {
    console.error("Add blog post reaction error:", error);
    return { success: false, error: "Failed to add reaction" };
  }
}

/**
 * Remove a reaction from a blog post
 */
export async function removeBlogPostReaction(blogPostId: string) {
  try {
    const session = await getCurrentSession();
    const isAdmin = session?.user?.role === "admin";

    const reaction = await db.query.reactions.findFirst({
      where: and(
        eq(reactions.blogPostId, blogPostId),
        eq(reactions.isAdmin, isAdmin)
      ),
      orderBy: (reactions, { desc }) => [desc(reactions.createdAt)],
    });

    if (!reaction) {
      return { success: false, error: "No reaction found" };
    }

    await db.delete(reactions).where(eq(reactions.id, reaction.id));

    revalidateTag(BLOG_TAG, 'default');
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${blogPostId}`);

    return { success: true };
  } catch (error) {
    console.error("Remove blog post reaction error:", error);
    return { success: false, error: "Failed to remove reaction" };
  }
}

