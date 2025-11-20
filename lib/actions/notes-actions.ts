"use server";

import { db } from "../../db/drizzle";
import { notes } from "../../db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath, revalidateTag } from "next/cache";
import { getCurrentSession } from "../auth-helper";

const NOTE_TAG = "public-notes";
const WORD_CLOUD_TAG = "word-cloud";

/**
 * Create a new note
 * Anyone can create, but isAdmin flag is set based on session
 */
export async function createNote(data: {
  title?: string;
  content: string;
  userName?: string;
  imageUrl?: string;
  color?: string;
  isPrivate: boolean;
}) {
  try {
    const session = await getCurrentSession();
    const isAdmin = session?.user?.role === "admin";

    const noteId = nanoid();

    await db.insert(notes).values({
      id: noteId,
      title: data.title || null,
      content: data.content,
      userName: data.userName || null,
      isAdmin,
      imageUrl: data.imageUrl || null,
      color: data.color || "#ffffff",
      isPrivate: data.isPrivate,
      isPinned: false,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidateTag(NOTE_TAG);
    revalidateTag(WORD_CLOUD_TAG);
    revalidatePath("/");
    revalidatePath("/notes");
    revalidatePath("/admin");

    return { success: true, noteId };
  } catch (error) {
    console.error("Create note error:", error);
    return { success: false, error: "Failed to create note" };
  }
}

/**
 * Update a note (admin only)
 */
export async function updateNote(
  noteId: string,
  data: {
    title?: string;
    content?: string;
    userName?: string;
    imageUrl?: string;
    color?: string;
    isPrivate?: boolean;
  }
) {
  try {
    const session = await getCurrentSession();
    if (session?.user?.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    await db
      .update(notes)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(notes.id, noteId));

    revalidateTag(NOTE_TAG);
    revalidateTag(WORD_CLOUD_TAG);
    revalidatePath("/");
    revalidatePath("/notes");
    revalidatePath("/admin");
    revalidatePath(`/notes/${noteId}`);

    return { success: true };
  } catch (error) {
    console.error("Update note error:", error);
    return { success: false, error: "Failed to update note" };
  }
}

/**
 * Delete a note (soft delete, admin only)
 */
export async function deleteNote(noteId: string) {
  try {
    const session = await getCurrentSession();
    if (session?.user?.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    await db
      .update(notes)
      .set({
        isDeleted: true,
        updatedAt: new Date(),
      })
      .where(eq(notes.id, noteId));

    revalidateTag(NOTE_TAG);
    revalidateTag(WORD_CLOUD_TAG);
    revalidatePath("/");
    revalidatePath("/notes");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Delete note error:", error);
    return { success: false, error: "Failed to delete note" };
  }
}

/**
 * Pin/unpin a note (admin only)
 */
export async function togglePinNote(noteId: string, isPinned: boolean) {
  try {
    const session = await getCurrentSession();
    if (session?.user?.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    await db
      .update(notes)
      .set({
        isPinned,
        updatedAt: new Date(),
      })
      .where(eq(notes.id, noteId));

    revalidateTag(NOTE_TAG);
    revalidatePath("/");
    revalidatePath("/notes");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Toggle pin note error:", error);
    return { success: false, error: "Failed to toggle pin" };
  }
}
