import { getPublicNotes } from "@/lib/queries/notes";
import NoteList from "@/components/notes/note-list";
import Container from "@/components/shared/container";
import { isAdmin } from "@/lib/auth-helper";

export default async function NotesPage() {
  const notes = await getPublicNotes();
  const adminStatus = await isAdmin();

  return (
    <Container className="m-12">
      <h1>All Notes</h1>
      <NoteList notes={notes} isUserAdmin={adminStatus} />
    </Container>
  );
}
