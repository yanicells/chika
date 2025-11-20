import { getNoteWithReactions } from "@/lib/queries/notes";
import { getCommentsWithReactions } from "@/lib/queries/comments";
import NoteDetail from "@/components/notes/note-detail";
import CommentList from "@/components/comments/comment-list";
import CommentForm from "@/components/comments/comment-form";
import { notFound } from "next/navigation";
import Container from "@/components/shared/container";
import { isAdmin } from "@/lib/auth-helper";
import BackButton from "@/components/ui/back-button";

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
    <div className="max-w-[85rem] mx-auto px-4 lg:px-8">
      <div className="pt-12 pb-8">
        <BackButton></BackButton>
        {/* Note Detail */}
        <NoteDetail note={note} isUserAdmin={adminStatus} />

        {/* Comments Section - More spacing */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-text mb-6">
            💬 Comments ({comments.length})
          </h2>

          <div className="space-y-6">
            <CommentList comments={comments} isUserAdmin={adminStatus} />
            <CommentForm noteId={id} />
          </div>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="pb-32" />
    </div>
  );
}
