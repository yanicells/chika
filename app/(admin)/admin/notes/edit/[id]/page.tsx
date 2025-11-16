import { requireAdmin } from "@/lib/auth-helper";
import { getNoteById } from "@/lib/queries/notes";
import { notFound } from "next/navigation";
import EditNoteForm from "@/components/notes/edit-note-form";

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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Note</h1>
      <EditNoteForm note={note} />
    </div>
  );
}
