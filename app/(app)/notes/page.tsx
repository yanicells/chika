import { Suspense } from 'react';
import Container from '@/components/shared/container';
import { getPublicNotesPaginated } from '@/lib/queries/notes';
import FilteredNoteList from '@/components/notes/filtered-note-list';
import NotesPagination from '@/components/notes/notes-pagination';
import { isAdmin } from '@/lib/auth-helper';
import type { FilterType } from '@/components/notes/note-filter';

interface NotesPageProps {
  searchParams: Promise<{ page?: string; filter?: string }>;
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const { page, filter } = await searchParams;
  const currentPage = Number(page) || 1;
  const activeFilter = (filter as FilterType) || "all";

  // Validate filter
  const validFilters: FilterType[] = ["all", "admin", "username", "anonymous", "pinned"];
  const validatedFilter = validFilters.includes(activeFilter) ? activeFilter : "all";

  const { notes, totalPages } = await getPublicNotesPaginated(currentPage, 9, validatedFilter);
  const adminStatus = await isAdmin();

  return (
    <Container>
      <div className="pt-12 pb-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text mb-2">Notes</h1>
          <p className="text-lg text-subtext1">Chika&apos;s people have sent</p>
        </div>

        {/* Notes Grid with Filters */}
        {notes.length > 0 || validatedFilter !== "all" ? (
          <>
            <Suspense fallback={<div className="text-center py-12 text-subtext0">Loading notes...</div>}>
              <FilteredNoteList 
                notes={notes} 
                isUserAdmin={adminStatus}
                initialFilter={validatedFilter}
              />
            </Suspense>
            
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
        ) : (
          <p className="text-center text-subtext0 py-8">No notes yet.</p>
        )}
      </div>
    </Container>
  );
}
