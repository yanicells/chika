import { requireAdmin } from "@/lib/auth-helper";
import { getAllNotes } from "@/lib/queries/notes";
import AdminNotes from "@/components/notes/admin-notes";
import Container from "@/components/shared/container";

export default async function PrivateNotesPage() {
  await requireAdmin();
  const allNotes = await getAllNotes();

  return (
    <Container>
      <div className="py-8">
        <div className="mb-12">
        </div>

        <AdminNotes initialNotes={allNotes} />
      </div>
    </Container>
  );
}
