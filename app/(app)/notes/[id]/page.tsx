import { getNoteWithReactions } from "@/lib/queries/notes";
import { getCommentsWithReactions } from "@/lib/queries/comments";
import NoteDetail from "@/components/notes/note-detail";
import NoteDetailSkeleton from "@/components/notes/note-detail-skeleton";
import CommentList from "@/components/comments/comment-list";
import CommentForm from "@/components/comments/comment-form";
import CommentSkeleton from "@/components/comments/comment-skeleton";
import { notFound } from "next/navigation";
import { isAdmin } from "@/lib/auth-helper";
import BackButton from "@/components/ui/back-button";
import { Suspense } from "react";

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="max-w-[85rem] mx-auto px-4 lg:px-8">
      <div className="pt-12 pb-8">
        <BackButton></BackButton>

        <Suspense fallback={<NoteDetailSkeleton />}>
          <NoteContent id={id} />
        </Suspense>
      </div>

      {/* Bottom Spacing */}
      <div className="pb-32" />
    </div>
  );
}

async function NoteContent({ id }: { id: string }) {
  const note = await getNoteWithReactions(id);
  const adminStatus = await isAdmin();

  if (!note) {
    notFound();
  }

  return (
    <>
      <NoteDetail note={note} isUserAdmin={adminStatus} />

      {/* Comments Section - More spacing */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-text mb-6 flex items-center gap-2">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <Suspense fallback={<span>Loading...</span>}>
            <CommentCount noteId={id} />
          </Suspense>
        </h2>

        <div className="space-y-6">
          <Suspense fallback={<CommentListFallback />}>
            <NoteCommentSection noteId={id} isUserAdmin={adminStatus} />
          </Suspense>
          <CommentForm noteId={id} />
        </div>
      </div>
    </>
  );
}

async function CommentCount({ noteId }: { noteId: string }) {
  const comments = await getCommentsWithReactions(noteId);
  return <>Comments ({comments.length})</>;
}

async function NoteCommentSection({
  noteId,
  isUserAdmin,
}: {
  noteId: string;
  isUserAdmin: boolean;
}) {
  const comments = await getCommentsWithReactions(noteId);
  return <CommentList comments={comments} isUserAdmin={isUserAdmin} />;
}

function CommentListFallback() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <CommentSkeleton key={`comment-skeleton-${i}`} />
      ))}
    </div>
  );
}
