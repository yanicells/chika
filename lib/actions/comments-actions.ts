"use server";

import { db } from "../../db/drizzle";
import { comments } from "../../db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { getCurrentSession } from "../auth-helper";

/**
 * Create a comment on a note
 * Anyone can comment, but isAdmin flag is set based on session
 */
export async function createNoteComment(data: {
  noteId: string;
  content: string;
  userName?: string;
}) {
  try {
    const session = await getCurrentSession();
    const isAdmin = session?.user?.role === "admin";

    const commentId = nanoid();

    await db.insert(comments).values({
      id: commentId,
      noteId: data.noteId,
      blogPostId: null,
      userName: data.userName || null,
      isAdmin,
      content: data.content,
      isDeleted: false,
      createdAt: new Date(),
    });

    revalidatePath(`/notes/${data.noteId}`);
    revalidatePath("/");

    return { success: true, commentId };
  } catch (error) {
    console.error("Create note comment error:", error);
    return { success: false, error: "Failed to create comment" };
  }
}

/**
 * Create a comment on a blog post
 * Anyone can comment, but isAdmin flag is set based on session
 */
export async function createBlogComment(data: {
  blogPostId: string;
  content: string;
  userName?: string;
}) {
  try {
    const session = await getCurrentSession();
    const isAdmin = session?.user?.role === "admin";

    const commentId = nanoid();

    await db.insert(comments).values({
      id: commentId,
      noteId: null,
      blogPostId: data.blogPostId,
      userName: data.userName || null,
      isAdmin,
      content: data.content,
      isDeleted: false,
      createdAt: new Date(),
    });

    revalidatePath(`/blog/${data.blogPostId}`);

    return { success: true, commentId };
  } catch (error) {
    console.error("Create blog comment error:", error);
    return { success: false, error: "Failed to create comment" };
  }
}

/**
 * Update a comment (admin only)
 */
export async function updateComment(commentId: string, content: string) {
  try {
    const session = await getCurrentSession();
    if (session?.user?.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    await db
      .update(comments)
      .set({ content })
      .where(eq(comments.id, commentId));

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Update comment error:", error);
    return { success: false, error: "Failed to update comment" };
  }
}

/**
 * Delete a comment (soft delete, admin only)
 */
export async function deleteComment(commentId: string) {
  try {
    const session = await getCurrentSession();
    if (session?.user?.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    await db
      .update(comments)
      .set({ isDeleted: true })
      .where(eq(comments.id, commentId));

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Delete comment error:", error);
    return { success: false, error: "Failed to delete comment" };
  }
}
