import { getPublicNotes } from "@/lib/queries/notes";
import FilteredNoteList from "@/components/notes/filtered-note-list";
import Container from "@/components/shared/container";
import { isAdmin } from "@/lib/auth-helper";

export default async function NotesPage() {
  const notes = await getPublicNotes();
  const adminStatus = await isAdmin();

  return (
    <div className="max-w-[85rem] mx-auto px-4 lg:px-8 my-12">
      <h1>All Notes</h1>
      <FilteredNoteList notes={notes} isUserAdmin={adminStatus} />

      {/* Bottom Spacing */}
      <div className="pb-32" />
    </div>
  );
}
