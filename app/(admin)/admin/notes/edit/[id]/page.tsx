import { requireAdmin } from "@/lib/auth-helper";
import { getNoteById } from "@/lib/queries/notes";
import { notFound } from "next/navigation";
import EditNoteForm from "@/components/notes/edit-note-form";
import Container from "@/components/shared/container";

export default async function EditNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const note = await getNoteById(id);

  if (!note) {
    notFound();
  }

  return (
    <Container size="md">
      <div className="py-8">
        <h1 className="text-3xl font-bold text-text mb-2">Edit Note</h1>
        <p className="text-subtext1 mb-8">
          Update the content and settings for this note
        </p>

        <EditNoteForm note={note} />
      </div>
    </Container>
  );
}
