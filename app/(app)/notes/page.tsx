import { Suspense } from "react";
import Container from "@/components/shared/container";
import { getPublicNotesPaginated } from "@/lib/queries/notes";
import { getCommentsWithReactions } from "@/lib/queries/comments";
import FilteredNoteList from "@/components/notes/filtered-note-list";
import NotesPagination from "@/components/notes/notes-pagination";
import NoteCardSkeleton from "@/components/notes/note-card-skeleton";
import { isAdmin } from "@/lib/auth-helper";
import type { FilterType } from "@/components/notes/note-filter";

interface NotesPageProps {
  searchParams: Promise<{ page?: string; filter?: string }>;
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const { page, filter } = await searchParams;
  const currentPage = Number(page) || 1;
  const activeFilter = (filter as FilterType) || "all";

  // Validate filter
  const validFilters: FilterType[] = [
    "all",
    "admin",
    "username",
    "anonymous",
    "pinned",
  ];
  const validatedFilter = validFilters.includes(activeFilter)
    ? activeFilter
    : "all";

  return (
    <Container>
      <div className="pt-12 pb-8">
        <Suspense fallback={<NotesGridFallback />}>
          <NotesContent
            currentPage={currentPage}
            validatedFilter={validatedFilter}
          />
        </Suspense>
      </div>
    </Container>
  );
}

async function NotesContent({
  currentPage,
  validatedFilter,
}: {
  currentPage: number;
  validatedFilter: FilterType;
}) {
  const { notes, totalPages } = await getPublicNotesPaginated(
    currentPage,
    9,
    validatedFilter
  );
  const adminStatus = await isAdmin();

  // Fetch comment counts for all notes
  const notesWithComments = await Promise.all(
    notes.map(async (note) => {
      const comments = await getCommentsWithReactions(note.id);
      return {
        ...note,
        commentCount: comments.length,
      };
    })
  );

  if (notesWithComments.length === 0 && validatedFilter === "all") {
    return <p className="text-center text-subtext0 py-8">No notes yet.</p>;
  }

  return (
    <>
      <FilteredNoteList
        notes={notesWithComments}
        isUserAdmin={adminStatus}
        initialFilter={validatedFilter}
      />

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="mt-12 flex justify-center">
          <NotesPagination
            currentPage={currentPage}
            totalPages={totalPages}
            filter={validatedFilter}
          />
        </div>
      )}
    </>
  );
}

function NotesGridFallback() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-text mb-2">Notes</h1>
        <div className="flex items-center justify-between">
          <p className="text-lg text-subtext1">Chika&apos;s people have sent</p>
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-2 px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm bg-surface0 border-2 border-overlay0 rounded-lg text-text opacity-50 cursor-not-allowed"
          >
            All Notes
            <svg
              className="w-4 h-4 text-overlay0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-0">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={`note-skeleton-${index}`}
            className="break-inside-avoid mb-6"
          >
            <NoteCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}
