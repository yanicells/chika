import { db } from "../../db/drizzle";
import { notes } from "../../db/schema";
import { and, desc, eq } from "drizzle-orm";

export async function getPublicNotes() {
  return await db
    .select()
    .from(notes)
    .where(and(eq(notes.isDeleted, false), eq(notes.isPrivate, false)))
    .orderBy(desc(notes.isPinned), desc(notes.createdAt));
}
