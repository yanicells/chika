"use client";

import Link from "next/link";
import { BlogPost } from "@/db/schema";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import ReactionDisplay from "@/components/reactions/reaction-display";
import ReactionButton from "@/components/reactions/reaction-button";
import EditButton from "@/components/ui/edit-button";

interface BlogDetailProps {
  post: BlogPost & {
    reactions?: {
      regular: number;
      admin: number;
    };
  };
  isUserAdmin: boolean;
  hasReacted?: boolean;
}

export default function BlogDetail({
  post,
  isUserAdmin = false,
  hasReacted = false,
}: BlogDetailProps) {
  const backgroundColor = post.color || "#ffffff";

  return (
    <Card
      className="max-w-7xl mx-auto border-t-4 relative transition-shadow duration-200"
      style={{
        borderTopColor: backgroundColor,
        backgroundColor: `${backgroundColor}25`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 4px 12px ${backgroundColor}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "";
      }}
    >
      <div
        className="absolute top-3 right-3 w-3 h-3 rounded-full"
        style={{ backgroundColor }}
      />
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {post.isPinned && (
              <Badge variant="warning" size="sm">
                📌 Pinned
              </Badge>
            )}
            {!post.isPublished && isUserAdmin && (
              <Badge variant="default" size="sm">
                Draft
              </Badge>
            )}
          </div>
          {isUserAdmin && (
            <Link href={`/admin/blog/edit/${post.id}`}>
              <Button variant="secondary" size="sm">
                Edit
              </Button>
            </Link>
          )}
        </div>

        <h1 className="text-4xl font-bold text-text">{post.title}</h1>

        {post.coverImageUrl && (
          <div>
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="w-full max-h-96 object-cover rounded-lg"
            />
          </div>
        )}

        {post.excerpt && (
          <p className="text-xl text-subtext1 italic">{post.excerpt}</p>
        )}

        <div className="prose max-w-none">
          <div className="text-subtext1 whitespace-pre-wrap leading-relaxed">
            {post.content}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-subtext0 pt-4 border-t border-overlay0 font-mono">
          <div className="flex flex-col gap-1">
            <span>
              Published:{" "}
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString()
                : "Not published"}
            </span>
            <span>
              Created: {new Date(post.createdAt).toLocaleDateString()}
            </span>
            {post.updatedAt &&
              post.updatedAt.getTime() !== post.createdAt.getTime() && (
                <span>
                  Updated: {new Date(post.updatedAt).toLocaleDateString()}
                </span>
              )}
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-overlay0">
          {post.reactions && (
            <>
              <ReactionDisplay reactions={post.reactions} />
              <ReactionButton
                type="blogPost"
                id={post.id}
                hasReacted={hasReacted}
              />
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
