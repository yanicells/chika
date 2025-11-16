import { getNoteWithReactions } from "@/lib/queries/notes";
import { getCommentsWithReactions } from "@/lib/queries/comments";
import NoteDetail from "@/components/notes/note-detail";
import CommentList from "@/components/comments/comment-list";
import CommentForm from "@/components/comments/comment-form";
import { notFound } from "next/navigation";
import Container from "@/components/shared/container";
import { isAdmin } from "@/lib/auth-helper";

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const note = await getNoteWithReactions(id);
  const adminStatus = await isAdmin();

  if (!note) {
    notFound();
  }

  const comments = await getCommentsWithReactions(id);

  return (
    <div className="max-w-[85rem] mx-auto px-4 lg:px-8 my-12">
      <NoteDetail note={note} isAdmin={adminStatus} />

      <h2>Comments</h2>
      <CommentList comments={comments} />
      <CommentForm noteId={id} />

      {/* Bottom Spacing */}
      <div className="pb-32" />
    </div>
  );
}
