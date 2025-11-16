"use client";

import { Comment } from "@/db/schema";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import AdminBadge from "@/components/admin/admin-badge";
import ReactionButton from "@/components/reactions/reaction-button";
import { deleteComment } from "@/lib/actions/comments-actions";
import { useState } from "react";

interface CommentCardProps {
  comment: Comment & {
    reactions?: {
      regular: number;
      admin: number;
    };
  };
  isUserAdmin?: boolean;
  hasReacted?: boolean;
}

export default function CommentCard({
  comment,
  isUserAdmin = false,
  hasReacted = false,
}: CommentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const displayName = comment.userName || "Anonymous";
  const backgroundColor = comment.color || "#ffffff";

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteComment(comment.id);
      if (result.success) {
        window.location.reload();
      } else {
        alert(result.error || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Delete comment error:", error);
      alert("An error occurred while deleting the comment");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card
      padding="sm"
      className="border-t-4 relative transition-shadow duration-200"
      style={{
        borderTopColor: backgroundColor,
        backgroundColor: `${backgroundColor}20`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 4px 12px ${backgroundColor}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "";
      }}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {comment.isAdmin && <AdminBadge />}
            {comment.isPrivate && (
              <Badge variant="default" size="sm">
                🔒 Private
              </Badge>
            )}
            <span className="text-sm font-medium text-text">{displayName}</span>
          </div>
          <span className="text-xs text-subtext0 font-mono">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>

        <p className="text-subtext1 text-sm whitespace-pre-wrap">
          {comment.content}
        </p>

        {comment.imageUrl && (
          <div className="mt-3">
            <img
              src={comment.imageUrl}
              alt="Comment attachment"
              className="max-w-md w-full h-auto rounded-lg border border-overlay0 object-cover"
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-overlay0">
          <div className="flex items-center gap-3">
            {comment.reactions && (
              <ReactionButton
                type="comment"
                id={comment.id}
                initialCount={comment.reactions}
                color={backgroundColor}
                isAdmin={isUserAdmin}
                hasReacted={hasReacted}
              />
            )}
          </div>

          {isUserAdmin && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
