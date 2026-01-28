"use client";

import { useCallback } from "react";
import { Note } from "@/db/schema";
import NoteCard from "./note-card";
import NoteCardSkeleton from "./note-card-skeleton";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import {
  fetchNotesInfinite,
  type NoteWithMeta,
} from "@/lib/actions/infinite-scroll-actions";
import type { FilterType } from "./note-filter";

type SortType =
  | "default"
  | "most-comments"
  | "least-comments"
  | "most-likes"
  | "least-likes"
  | "newest"
  | "oldest";

interface InfiniteNoteListProps {
  initialNotes: (Note & {
    reactions?: {
      regular: number;
      admin: number;
    };
    commentCount?: number;
  })[];
  initialHasMore: boolean;
  initialCursor: string | null;
  isUserAdmin?: boolean;
  filter: FilterType;
  sort: SortType;
}

export default function InfiniteNoteList({
  initialNotes,
  initialHasMore,
  initialCursor,
  isUserAdmin = false,
  filter,
  sort,
}: InfiniteNoteListProps) {
  const fetchMore = useCallback(
    async (cursor: string | null) => {
      return fetchNotesInfinite(cursor, filter, sort);
    },
    [filter, sort],
  );

  const { items, isLoading, hasMore, sentinelRef } =
    useInfiniteScroll<NoteWithMeta>({
      initialItems: initialNotes as NoteWithMeta[],
      fetchMore,
      initialCursor,
      initialHasMore,
      rootMargin: "600px", // Start loading before reaching the end
    });

  if (items.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-subtext0 text-lg">
          No notes yet. Be the first to share!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notes Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-0">
        {items.map((note) => (
          <div key={note.id} className="break-inside-avoid mb-6">
            <NoteCard
              note={
                note as Note & {
                  reactions?: { regular: number; admin: number };
                  commentCount?: number;
                }
              }
              isUserAdmin={isUserAdmin}
            />
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-0">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`loading-skeleton-${index}`}
              className="break-inside-avoid mb-6"
            >
              <NoteCardSkeleton />
            </div>
          ))}
        </div>
      )}

      {/* Sentinel element for intersection observer */}
      {hasMore && !isLoading && (
        <div ref={sentinelRef} className="h-4 w-full" aria-hidden="true" />
      )}

      {/* End of content indicator */}
      {!hasMore && items.length > 0 && (
        <div className="text-center py-8">
          <p className="text-subtext0 text-sm">You&apos;ve reached the end!</p>
        </div>
      )}
    </div>
  );
}
