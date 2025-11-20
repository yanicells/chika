import { db } from "../../db/drizzle";
import { notes, reactions, comments } from "../../db/schema";
import { and, desc, eq, sql, count, or, isNull, isNotNull, ne } from "drizzle-orm";

/**
 * Get all public notes (not deleted, not private)
 * Ordered by pinned first, then newest
 */
export async function getPublicNotes() {
  const notesData = await db
    .select()
    .from(notes)
    .where(and(eq(notes.isDeleted, false), eq(notes.isPrivate, false)))
    .orderBy(desc(notes.isPinned), desc(notes.createdAt));

  // Use existing getNoteWithReactions for each note
  const notesWithReactions = await Promise.all(
    notesData.map((note) => getNoteWithReactions(note.id))
  );

  return notesWithReactions.filter((note) => note !== null);
}

/**
 * Get all private notes (admin only)
 * Should only be called after auth check
 */
export async function getPrivateNotes() {
  return await db
    .select()
    .from(notes)
    .where(and(eq(notes.isDeleted, false), eq(notes.isPrivate, true)))
    .orderBy(desc(notes.isPinned), desc(notes.createdAt));
}

/**
 * Get all notes (public + private, admin only)
 * Should only be called after auth check
 */
export async function getAllNotes() {
  const notesData = await db
    .select()
    .from(notes)
    .where(eq(notes.isDeleted, false))
    .orderBy(desc(notes.isPinned), desc(notes.createdAt));

  // Get reactions and comment counts for each note
  const notesWithData = await Promise.all(
    notesData.map(async (note) => {
      const reactionCounts = await db
        .select({
          regularCount: sql<number>`count(*) filter (where ${reactions.isAdmin} = false)`,
          adminCount: sql<number>`count(*) filter (where ${reactions.isAdmin} = true)`,
        })
        .from(reactions)
        .where(eq(reactions.noteId, note.id));

      const commentCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(comments)
        .where(eq(comments.noteId, note.id));

      return {
        ...note,
        reactions: {
          regular: Number(reactionCounts[0]?.regularCount || 0),
          admin: Number(reactionCounts[0]?.adminCount || 0),
        },
        _count: {
          comments: Number(commentCount[0]?.count || 0),
        },
      };
    })
  );

  return notesWithData;
}

/**
 * Get single note by ID
 * Returns null if not found or deleted
 */
export async function getNoteById(id: string) {
  const result = await db
    .select()
    .from(notes)
    .where(and(eq(notes.id, id), eq(notes.isDeleted, false)))
    .limit(1);

  return result[0] || null;
}

/**
 * Get note with reaction count
 */
export async function getNoteWithReactions(id: string) {
  const note = await getNoteById(id);
  if (!note) return null;

  const reactionCounts = await db
    .select({
      regularCount: sql<number>`count(*) filter (where ${reactions.isAdmin} = false)`,
      adminCount: sql<number>`count(*) filter (where ${reactions.isAdmin} = true)`,
    })
    .from(reactions)
    .where(eq(reactions.noteId, id));

  return {
    ...note,
    reactions: {
      regular: Number(reactionCounts[0]?.regularCount || 0),
      admin: Number(reactionCounts[0]?.adminCount || 0),
    },
  };
}

/**
 * Get pinned notes only (public)
 */
export async function getPinnedNotes() {
  return await db
    .select()
    .from(notes)
    .where(
      and(
        eq(notes.isDeleted, false),
        eq(notes.isPrivate, false),
        eq(notes.isPinned, true)
      )
    )
    .orderBy(desc(notes.createdAt));
}

/**
 * Get public notes with pagination and filtering
 */
export async function getPublicNotesPaginated(
  page: number = 1,
  limit: number = 9,
  filter: "all" | "admin" | "username" | "anonymous" | "pinned" = "all"
) {
  const offset = (page - 1) * limit;

  // Build base conditions
  const baseConditions = and(
    eq(notes.isDeleted, false),
    eq(notes.isPrivate, false)
  );

  // Add filter conditions
  let filterConditions = baseConditions;
  if (filter === "admin") {
    filterConditions = and(baseConditions, eq(notes.isAdmin, true));
  } else if (filter === "pinned") {
    filterConditions = and(baseConditions, eq(notes.isPinned, true));
  } else if (filter === "username") {
    filterConditions = and(
      baseConditions,
      isNotNull(notes.userName),
      ne(notes.userName, "")
    );
  } else if (filter === "anonymous") {
    filterConditions = and(
      baseConditions,
      or(isNull(notes.userName), eq(notes.userName, ""))
    );
  }

  const notesList = await db
    .select()
    .from(notes)
    .where(filterConditions)
    .orderBy(desc(notes.isPinned), desc(notes.createdAt))
    .limit(limit)
    .offset(offset);

  // Get reactions for each note
  const notesWithReactions = await Promise.all(
    notesList.map((note) => getNoteWithReactions(note.id))
  );

  const filteredNotes = notesWithReactions.filter((note) => note !== null);

  // Get total count with same filter
  const totalResult = await db
    .select({ count: count() })
    .from(notes)
    .where(filterConditions);

  const total = totalResult[0]?.count || 0;
  const totalPages = Math.ceil(total / limit);

  return {
    notes: filteredNotes,
    currentPage: page,
    totalPages,
    total,
  };
}
