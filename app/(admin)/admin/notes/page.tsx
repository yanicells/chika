import { requireAdmin } from "@/lib/auth-helper";
import { getAllNotes } from "@/lib/queries/notes";
import AdminNotes from "@/components/notes/admin-notes";
import Container from "@/components/shared/container";

export default async function PrivateNotesPage() {
  await requireAdmin();
  const allNotes = await getAllNotes();

  return (
    <Container>
      <h1>Notes</h1>
      <AdminNotes initialNotes={allNotes} />
    </Container>
  );
}
