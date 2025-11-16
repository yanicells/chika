"use client";

import Link from "next/link";
import { BlogPost } from "@/db/schema";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import EditButton from "@/components/ui/edit-button";
import ReactionDisplay from "@/components/reactions/reaction-display";
import ReactionButton from "@/components/reactions/reaction-button";

interface BlogCardProps {
  post: BlogPost & {
    reactions?: {
      regular: number;
      admin: number;
    };
  };
  isUserAdmin?: boolean;
}

export default function BlogCard({ post, isUserAdmin = false }: BlogCardProps) {
  const excerpt = post.excerpt || post.content.substring(0, 150);
  const truncatedExcerpt =
    excerpt.length > 150 ? `${excerpt.substring(0, 150)}...` : excerpt;
  const backgroundColor = post.color || "#ffffff";

  return (
    <Card
      className="h-full flex flex-col border-t-4 relative transition-shadow duration-200"
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
      <Link href={`/blog/${post.slug}`} className="flex-1">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-3">
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
          </div>

          <h3 className="text-xl font-semibold text-text mb-2 hover:text-blue transition-colors">
            {post.title}
          </h3>

          {post.coverImageUrl && (
            <div className="mb-4">
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className="w-full h-48 object-cover rounded-md"
              />
            </div>
          )}

          <p className="text-subtext1 mb-4 line-clamp-3">{truncatedExcerpt}</p>

          <div className="text-sm text-subtext0 mb-3 font-mono">
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString()
              : new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>
      </Link>

      {post.reactions && (
        <div className="flex items-center gap-3 mb-3">
          <ReactionDisplay reactions={post.reactions} />
          <ReactionButton type="blogPost" id={post.id} hasReacted={false} />
        </div>
      )}

      {isUserAdmin && (
        <div className="mt-auto pt-4 border-t border-overlay0">
          <EditButton type="blog" id={post.id} />
        </div>
      )}
    </Card>
  );
}
