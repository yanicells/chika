import { getPublicNotes } from "@/lib/queries/notes";
import NoteList from "@/components/notes/note-list";

export default async function NotesPage() {
  const notes = await getPublicNotes();

  return (
    <div>
      <h1>All Notes</h1>
      <NoteList notes={notes} />
    </div>
  );
}
