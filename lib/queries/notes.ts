import { db } from "../../db/drizzle";
import { notes, reactions, comments } from "../../db/schema";
import {
  and,
  desc,
  asc,
  eq,
  sql,
  count,
  or,
  isNull,
  isNotNull,
  ne,
} from "drizzle-orm";
import { withCache } from "@/lib/cache";

type SortType =
  | "default"
  | "most-comments"
  | "least-comments"
  | "most-likes"
  | "least-likes"
  | "newest"
  | "oldest";

/**
 * Get all public notes (not deleted, not private)
 * Ordered by pinned first, then newest
 */
export const getPublicNotes = withCache(
  async () => {
    const notesData = await db
      .select()
      .from(notes)
      .where(and(eq(notes.isDeleted, false), eq(notes.isPrivate, false)))
      .orderBy(desc(notes.isPinned), desc(notes.createdAt));

    // Use existing getNoteWithReactions for each note
    const notesWithReactions = await Promise.all(
      notesData.map((note) => getNoteWithReactions(note.id)),
    );

    return notesWithReactions.filter((note) => note !== null);
  },
  ["getPublicNotes"],
  { tags: ["public-notes"] },
);

/**
 * Get all private notes (admin only)
 * Should only be called after auth check
 */
export const getPrivateNotes = withCache(
  async () => {
    const notesData = await db
      .select()
      .from(notes)
      .where(and(eq(notes.isDeleted, false), eq(notes.isPrivate, true)))
      .orderBy(desc(notes.isPinned), desc(notes.createdAt));

    return notesData;
  },
  ["getPrivateNotes"],
  { tags: ["public-notes"] },
);

/**
 * Get all notes (public + private, admin only)
 * Should only be called after auth check
 */
export const getAllNotes = withCache(
  async () => {
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
      }),
    );

    return notesWithData;
  },
  ["getAllNotes"],
  { tags: ["public-notes"] },
);

/**
 * Get single note by ID
 * Returns null if not found or deleted
 */
export const getNoteById = withCache(
  async (id: string) => {
    const result = await db
      .select()
      .from(notes)
      .where(and(eq(notes.id, id), eq(notes.isDeleted, false)))
      .limit(1);

    return result[0] || null;
  },
  ["getNoteById"],
  { tags: ["public-notes"] },
);

/**
 * Get note with reaction count
 */
export const getNoteWithReactions = withCache(
  async (id: string) => {
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
  },
  ["getNoteWithReactions"],
  { tags: ["public-notes"] },
);

/**
 * Get pinned notes only (public)
 */
export const getPinnedNotes = withCache(
  async () => {
    return await db
      .select()
      .from(notes)
      .where(
        and(
          eq(notes.isDeleted, false),
          eq(notes.isPrivate, false),
          eq(notes.isPinned, true),
        ),
      )
      .orderBy(desc(notes.createdAt));
  },
  ["getPinnedNotes"],
  { tags: ["public-notes"] },
);

/**
 * Get public notes with pagination and filtering
 */
export const getPublicNotesPaginated = withCache(
  async (
    page: number = 1,
    limit: number = 9,
    filter: "all" | "admin" | "username" | "anonymous" | "pinned" = "all",
    sort: SortType = "default",
  ) => {
    const offset = (page - 1) * limit;

    // Build base conditions
    const baseConditions = and(
      eq(notes.isDeleted, false),
      eq(notes.isPrivate, false),
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
        ne(notes.userName, ""),
      );
    } else if (filter === "anonymous") {
      filterConditions = and(
        baseConditions,
        or(isNull(notes.userName), eq(notes.userName, "")),
      );
    }

    // Build query with aggregated counts for sorting
    const notesWithCounts = await db
      .select({
        id: notes.id,
        title: notes.title,
        content: notes.content,
        userName: notes.userName,
        isAdmin: notes.isAdmin,
        isPinned: notes.isPinned,
        isPrivate: notes.isPrivate,
        isDeleted: notes.isDeleted,
        imageUrl: notes.imageUrl,
        color: notes.color,
        createdAt: notes.createdAt,
        updatedAt: notes.updatedAt,
        commentCount: sql<number>`count(distinct ${comments.id})`.as(
          "comment_count",
        ),
        reactionCount: sql<number>`count(distinct ${reactions.id})`.as(
          "reaction_count",
        ),
      })
      .from(notes)
      .leftJoin(comments, eq(notes.id, comments.noteId))
      .leftJoin(reactions, eq(notes.id, reactions.noteId))
      .where(filterConditions)
      .groupBy(notes.id)
      .orderBy(
        // Secondary sort by ID ensures stable ordering for pagination
        // This prevents duplicates when items have the same count/date
        ...(sort === "most-comments"
          ? [desc(sql`comment_count`), desc(notes.id)]
          : sort === "least-comments"
            ? [asc(sql`comment_count`), desc(notes.id)]
            : sort === "most-likes"
              ? [desc(sql`reaction_count`), desc(notes.id)]
              : sort === "least-likes"
                ? [asc(sql`reaction_count`), desc(notes.id)]
                : sort === "newest"
                  ? [desc(notes.createdAt), desc(notes.id)]
                  : sort === "oldest"
                    ? [asc(notes.createdAt), desc(notes.id)]
                    : [
                        desc(notes.isPinned),
                        desc(notes.createdAt),
                        desc(notes.id),
                      ]),
      )
      .limit(limit)
      .offset(offset);

    // Get detailed reactions for each note
    const notesWithReactions = await Promise.all(
      notesWithCounts.map(async (note) => {
        const reactionCounts = await db
          .select({
            regularCount: sql<number>`count(*) filter (where ${reactions.isAdmin} = false)`,
            adminCount: sql<number>`count(*) filter (where ${reactions.isAdmin} = true)`,
          })
          .from(reactions)
          .where(eq(reactions.noteId, note.id));

        return {
          ...note,
          reactions: {
            regular: Number(reactionCounts[0]?.regularCount || 0),
            admin: Number(reactionCounts[0]?.adminCount || 0),
          },
        };
      }),
    );

    // Get total count with same filter
    const totalResult = await db
      .select({ count: count() })
      .from(notes)
      .where(filterConditions);

    const total = totalResult[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      notes: notesWithReactions,
      currentPage: page,
      totalPages,
      total,
    };
  },
  ["getPublicNotesPaginated"],
  { tags: ["public-notes"] },
);
