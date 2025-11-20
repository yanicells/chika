import { Suspense } from "react";
import Container from "@/components/shared/container";
import { getPublicNotesPaginated } from "@/lib/queries/notes";
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
        {/* Page Header */}

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

  if (notes.length === 0 && validatedFilter === "all") {
    return <p className="text-center text-subtext0 py-8">No notes yet.</p>;
  }

  return (
    <>
      <FilteredNoteList
        notes={notes}
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
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-0">
      {Array.from({ length: 9 }).map((_, index) => (
        <div key={`note-skeleton-${index}`} className="break-inside-avoid mb-6">
          <NoteCardSkeleton />
        </div>
      ))}
    </div>
  );
}
