"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
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
  initialSort?: SortType;
  initialHasMore: boolean;
  initialCursor: string | null;
}

export default function FilteredNoteList({
  notes,
  isUserAdmin = false,
  initialFilter = "all",
  initialSort = "default",
  initialHasMore,
  initialCursor,
}: FilteredNoteListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Track hydration to prevent layout shifts
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Use props for display (they come from server and match the key)
  // searchParams is used for navigation handlers only
  const activeFilter = initialFilter;
  const activeSort = initialSort;

  // Infinite scroll setup - uses props (initialFilter/initialSort) which are stable
  // because the component remounts when they change (via key prop)
  const fetchMore = useCallback(
    async (cursor: string | null) => {
      return fetchNotesInfinite(cursor, initialFilter, initialSort);
    },
    [initialFilter, initialSort],
  );

  // Memoize getItemKey to prevent unnecessary re-renders
  const getItemKey = useCallback((item: NoteWithMeta) => item.id, []);

  const { items, isLoading, hasMore, sentinelRef } =
    useInfiniteScroll<NoteWithMeta>({
      initialItems: notes as NoteWithMeta[],
      fetchMore,
      initialCursor,
      initialHasMore,
      rootMargin: "600px",
      getItemKey,
    });

  // Memoize the rendered notes to prevent unnecessary re-renders
  // which cause layout recalculations in CSS columns
  const renderedNotes = useMemo(() => {
    return items.map((note) => (
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
    ));
  }, [items, isUserAdmin]);

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
          {/* 
            CSS columns masonry with stabilization:
            - contain: layout prevents external layout recalculations
            - will-change: contents hints browser to optimize for content changes
            - opacity transition on hydration prevents visual flash
          */}
          <div
            className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-0 transition-opacity duration-150"
            style={{
              contain: "layout",
              opacity: isHydrated ? 1 : 0.99,
            }}
          >
            {renderedNotes}

            {/* Loading skeletons inline with masonry */}
            {isLoading &&
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`loading-skeleton-${index}`}
                  className="break-inside-avoid mb-6"
                >
                  <NoteCardSkeleton />
                </div>
              ))}
          </div>

          {/* Loading spinner for visual feedback */}
          {isLoading && (
            <div className="flex justify-center py-6">
              <div className="flex items-center gap-2 text-subtext0">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="text-sm">Loading more...</span>
              </div>
            </div>
          )}

          {/* Sentinel element for intersection observer */}
          {hasMore && !isLoading && (
            <div ref={sentinelRef} className="h-10 w-full" aria-hidden="true" />
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
