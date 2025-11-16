"use client";

import Link from "next/link";
import { BlogPost } from "@/db/schema";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import ReactionButton from "@/components/reactions/reaction-button";

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
      className="max-w-[85rem] mx-auto border-t-4 relative transition-shadow duration-200"
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

        <div className="flex items-center justify-between pt-4 border-t border-overlay0">
          <div className="text-sm text-subtext0 font-mono">
            <span>
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString()
                : new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
          {post.reactions && (
            <div className="flex items-center gap-3">
              <ReactionButton
                type="blogPost"
                id={post.id}
                initialCount={post.reactions}
                color={backgroundColor}
                isAdmin={isUserAdmin}
                hasReacted={hasReacted}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
