import { getNoteById } from "@/lib/queries/notes";
import { getCommentsWithReactions } from "@/lib/queries/comments";
import NoteDetail from "@/components/notes/note-detail";
import CommentList from "@/components/comments/comment-list";
import CommentForm from "@/components/comments/comment-form";
import { notFound } from "next/navigation";

export default async function NotePage({ params }: { params: { id: string } }) {
  const note = await getNoteById(params.id);

  if (!note) {
    notFound();
  }

  const comments = await getCommentsWithReactions(params.id);

  return (
    <div>
      <NoteDetail note={note} />

      <h2>Comments</h2>
      <CommentList comments={comments} />
      <CommentForm noteId={params.id} />
    </div>
  );
}
