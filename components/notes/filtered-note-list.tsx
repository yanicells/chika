"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Note } from "@/db/schema";
import NoteCard from "./note-card";
import NoteCardSkeleton from "./note-card-skeleton";
import { FilterType } from "./note-filter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import {
  fetchNotesInfinite,
  type NoteWithMeta,
} from "@/lib/actions/infinite-scroll-actions";

type SortType =
  | "default"
  | "most-comments"
  | "least-comments"
  | "most-likes"
  | "least-likes"
  | "newest"
  | "oldest";

interface FilteredNoteListProps {
  notes: (Note & {
    reactions?: {
      regular: number;
      admin: number;
    };
    commentCount?: number;
  })[];
  isUserAdmin?: boolean;
  initialFilter?: FilterType;
  initialHasMore: boolean;
  initialCursor: string | null;
}

export default function FilteredNoteList({
  notes,
  isUserAdmin = false,
  initialFilter = "all",
  initialHasMore,
  initialCursor,
}: FilteredNoteListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeFilter =
    (searchParams.get("filter") as FilterType) || initialFilter || "all";
  const activeSort = (searchParams.get("sort") as SortType) || "default";

  // Infinite scroll setup
  const fetchMore = useCallback(
    async (cursor: string | null) => {
      return fetchNotesInfinite(cursor, activeFilter, activeSort);
    },
    [activeFilter, activeSort],
  );

  const { items, isLoading, hasMore, sentinelRef } =
    useInfiniteScroll<NoteWithMeta>({
      initialItems: notes as NoteWithMeta[],
      fetchMore,
      initialCursor,
      initialHasMore,
      rootMargin: "600px",
    });

  const handleFilterChange = (filter: FilterType) => {
    const params = new URLSearchParams(searchParams.toString());
    if (filter === "all") {
      params.delete("filter");
    } else {
      params.set("filter", filter);
    }
    const queryString = params.toString();
    router.push(queryString ? `/notes?${queryString}` : "/notes");
  };

  const handleSortChange = (sort: SortType) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sort === "default") {
      params.delete("sort");
    } else {
      params.set("sort", sort);
    }
    const queryString = params.toString();
    router.push(queryString ? `/notes?${queryString}` : "/notes");
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-text mb-4">Notes</h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2">
          <p className="text-lg text-subtext1">Chika&apos;s people have sent</p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Sort Dropdown */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm bg-surface0 border-2 border-overlay0 rounded-lg text-text hover:border-subtext0 focus:outline-none focus:border-blue cursor-pointer"
                >
                  {activeSort === "default" && "Default"}
                  {activeSort === "most-comments" && "Most Comments"}
                  {activeSort === "least-comments" && "Least Comments"}
                  {activeSort === "most-likes" && "Most Likes"}
                  {activeSort === "least-likes" && "Least Likes"}
                  {activeSort === "newest" && "Newest"}
                  {activeSort === "oldest" && "Oldest"}
                  <ChevronDownIcon className="w-4 h-4 text-overlay0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="bg-surface0 border-2 border-overlay0 rounded-lg z-50 min-w-[160px]"
                align="end"
                sideOffset={8}
              >
                <DropdownMenuItem
                  onSelect={() => handleSortChange("default")}
                  className="text-sm text-text hover:bg-blue hover:text-base focus:bg-blue focus:text-base cursor-pointer"
                >
                  Default
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleSortChange("most-comments")}
                  className="text-sm text-text hover:bg-blue hover:text-base focus:bg-blue focus:text-base cursor-pointer"
                >
                  Most Comments
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleSortChange("least-comments")}
                  className="text-sm text-text hover:bg-blue hover:text-base focus:bg-blue focus:text-base cursor-pointer"
                >
                  Least Comments
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleSortChange("most-likes")}
                  className="text-sm text-text hover:bg-blue hover:text-base focus:bg-blue focus:text-base cursor-pointer"
                >
                  Most Likes
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleSortChange("least-likes")}
                  className="text-sm text-text hover:bg-blue hover:text-base focus:bg-blue focus:text-base cursor-pointer"
                >
                  Least Likes
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleSortChange("newest")}
                  className="text-sm text-text hover:bg-blue hover:text-base focus:bg-blue focus:text-base cursor-pointer"
                >
                  Newest
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleSortChange("oldest")}
                  className="text-sm text-text hover:bg-blue hover:text-base focus:bg-blue focus:text-base cursor-pointer"
                >
                  Oldest
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filter Dropdown */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm bg-surface0 border-2 border-overlay0 rounded-lg text-text hover:border-subtext0 focus:outline-none focus:border-blue cursor-pointer"
                >
                  {activeFilter === "all" && "All Notes"}
                  {activeFilter === "pinned" && "Pinned"}
                  {activeFilter === "admin" && "Yanicells"}
                  {activeFilter === "username" && "Not Anonymous"}
                  {activeFilter === "anonymous" && "Anonymous"}
                  <ChevronDownIcon className="w-4 h-4 text-overlay0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="bg-surface0 border-2 border-overlay0 rounded-lg z-50 min-w-[160px]"
                align="end"
                sideOffset={8}
              >
                <DropdownMenuItem
                  onSelect={() => handleFilterChange("all")}
                  className="text-sm text-text hover:bg-blue hover:text-base focus:bg-blue focus:text-base cursor-pointer"
                >
                  All Notes
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleFilterChange("pinned")}
                  className="text-sm text-text hover:bg-blue hover:text-base focus:bg-blue focus:text-base cursor-pointer"
                >
                  Pinned
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleFilterChange("admin")}
                  className="text-sm text-text hover:bg-blue hover:text-base focus:bg-blue focus:text-base cursor-pointer"
                >
                  Yanicells
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleFilterChange("username")}
                  className="text-sm text-text hover:bg-blue hover:text-base focus:bg-blue focus:text-base cursor-pointer"
                >
                  Not Anonymous
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleFilterChange("anonymous")}
                  className="text-sm text-text hover:bg-blue hover:text-base focus:bg-blue focus:text-base cursor-pointer"
                >
                  Anonymous
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {items.length === 0 && !isLoading ? (
        <div className="text-center py-12">
          <p className="text-subtext0 text-lg">
            {activeFilter === "all"
              ? "No notes yet. Be the first to share!"
              : "No notes found with the selected filter."}
          </p>
        </div>
      ) : (
        <>
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
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-0 mt-6">
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
              <p className="text-subtext0 text-sm">
                You&apos;ve reached the end!
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
