import { Comment } from '@/db/schema';
import CommentCard from './comment-card';

interface CommentListProps {
  comments: (Comment & {
    reactions?: {
      regular: number;
      admin: number;
    };
  })[];
  isUserAdmin?: boolean;
}

export default function CommentList({
  comments,
  isUserAdmin = false,
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          isUserAdmin={isUserAdmin}
        />
      ))}
    </div>
  );
}

