"use client";

import ReactMarkdown from "react-markdown";
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

        {/* Markdown Content */}
        <div className="prose prose-invert max-w-none text-sm">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="text-2xl font-bold text-text mt-4 mb-2" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-xl font-bold text-text mt-3 mb-2" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-lg font-bold text-text mt-2 mb-1" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="text-subtext1 mb-2 leading-relaxed" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc list-inside text-subtext1 mb-2 space-y-1" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal list-inside text-subtext1 mb-2 space-y-1" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="text-subtext1" {...props} />
              ),
              code: ({ node, ...props }) => (
                <code className="bg-surface0 text-pink px-2 py-1 rounded font-mono text-xs" {...props} />
              ),
              pre: ({ node, ...props }) => (
                <pre className="bg-surface0 p-3 rounded-lg mb-2 overflow-x-auto border border-overlay0 text-xs" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 border-blue pl-3 italic text-subtext1 my-2"
                  {...props}
                />
              ),
              a: ({ node, ...props }) => (
                <a className="text-blue hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
              ),
            }}
          >
            {comment.content}
          </ReactMarkdown>
        </div>

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
