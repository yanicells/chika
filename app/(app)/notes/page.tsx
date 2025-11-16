import { getPublicNotes } from "@/lib/queries/notes";
import FilteredNoteList from "@/components/notes/filtered-note-list";
import Container from "@/components/shared/container";
import { isAdmin } from "@/lib/auth-helper";

export default async function NotesPage() {
  const notes = await getPublicNotes();
  const adminStatus = await isAdmin();

  return (
    <div className="max-w-[85rem] mx-auto px-4 lg:px-8">
      <div className="pt-12 pb-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text mb-2">Notes</h1>
          <p className="text-lg text-subtext1">Chika's people have sent</p>
        </div>

        <FilteredNoteList notes={notes} isUserAdmin={adminStatus} />
      </div>

      {/* Bottom Spacing */}
      <div className="pb-32" />
    </div>
  );
}
