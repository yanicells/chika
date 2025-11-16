import { requireAdmin } from "@/lib/auth-helper";
import { getPrivateNotes } from "@/lib/queries/notes";
import NoteList from "@/components/notes/note-list";

export default async function PrivateNotesPage() {
  await requireAdmin();
  const notes = await getPrivateNotes();

  return (
    <div>
      <h1>Private Notes</h1>
      <NoteList notes={notes} isUserAdmin={true} />
    </div>
  );
}
