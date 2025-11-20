"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { BlogPost } from "@/db/schema";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import EditButton from "@/components/ui/edit-button";
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
        backgroundColor: `${backgroundColor}20`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 4px 12px ${backgroundColor}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "";
      }}
    >
      <Link href={`/blog/${post.slug}`} className="flex-1">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex flex-wrap items-center gap-2 mb-2">
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

          <h3 className="text-xl font-semibold text-text mb-2 hover:text-blue transition-colors -mt-4 -pt-2">
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

          {/* Markdown Content Preview */}
          <div className="prose prose-invert max-w-none mb-4 line-clamp-3 text-subtext1">
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => (
                  <p className="text-subtext1 mb-1 leading-relaxed" {...props} />
                ),
                h1: ({ node, ...props }) => (
                  <h1 className="text-lg font-bold text-text mb-1" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-base font-bold text-text mb-1" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-sm font-bold text-text mb-1" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc list-inside text-subtext1 mb-1 text-sm" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal list-inside text-subtext1 mb-1 text-sm" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="text-subtext1 text-sm" {...props} />
                ),
                code: ({ node, ...props }) => (
                  <code className="bg-surface0 text-pink px-1 py-0.5 rounded font-mono text-xs" {...props} />
                ),
                pre: ({ node, ...props }) => (
                  <pre className="bg-surface0 p-2 rounded mb-1 overflow-x-auto border border-overlay0 text-xs" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-l-2 border-blue pl-2 italic text-subtext1 my-1 text-sm"
                    {...props}
                  />
                ),
                a: ({ node, ...props }) => (
                  <a className="text-blue hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-bold text-text" {...props} />
                ),
                em: ({ node, ...props }) => (
                  <em className="italic" {...props} />
                ),
              }}
            >
              {truncatedExcerpt}
            </ReactMarkdown>
          </div>

          <div className="text-sm text-subtext0 mb-3 font-mono">
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString()
              : new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>
      </Link>

      {post.reactions && (
        <div className="flex items-center gap-3 mb-3">
          <ReactionButton
            type="blogPost"
            id={post.id}
            initialCount={post.reactions}
            color={backgroundColor}
            isAdmin={isUserAdmin}
            hasReacted={false}
          />
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
