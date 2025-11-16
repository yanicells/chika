import { getPublicNotes } from "@/lib/queries/notes";
import NoteList from "@/components/notes/note-list";
import Container from "@/components/shared/container";

export default async function HomePage() {
  const notes = await getPublicNotes();

  return (
    <Container>
      <h1>Recent Notes</h1>
      <NoteList notes={notes} />
    </Container>
  );
}
