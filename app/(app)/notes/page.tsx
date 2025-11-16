import { getPublicNotes } from "@/lib/queries/notes";
import NoteList from "@/components/notes/note-list";
import Container from "@/components/shared/container";

export default async function NotesPage() {
  const notes = await getPublicNotes();

  return (
    <Container className="m-12">
      <h1>All Notes</h1>
      <NoteList notes={notes} />
    </Container>
  );
}
