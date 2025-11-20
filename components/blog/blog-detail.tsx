/* eslint-disable @next/next/no-img-element */
"use client";
import ReactMarkdown from "react-markdown";
import { BlogPost } from "@/db/schema";
import Card from "@/components/ui/card";
import AdminBadge from "@/components/admin/admin-badge";
import ReactionButton from "@/components/reactions/reaction-button";
import ImageDialog from "@/components/ui/image-dialog";

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
  const backgroundColor = post.color || "#89b4fa";

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
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">{post.title}</h1>
          <p className="font-mono text-sm text-subtext0">
            {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
          </p>
        </div>
        <AdminBadge />
      </div>

      {/* Cover Image */}
      {post.coverImageUrl && (
        <ImageDialog
          src={post.coverImageUrl}
          alt={post.title}
          className="w-full h-96 object-cover rounded-lg mb-6 border border-overlay0"
        />
      )}

      {/* Markdown Content */}
      <div className="prose prose-invert max-w-none mb-6">
        <ReactMarkdown
          components={{
            h1: ({ node: _node, ...props }) => (
              <h1
                className="text-3xl font-bold text-text mt-6 mb-4"
                {...props}
              />
            ),
            h2: ({ node: _node, ...props }) => (
              <h2
                className="text-2xl font-bold text-text mt-5 mb-3"
                {...props}
              />
            ),
            h3: ({ node: _node, ...props }) => (
              <h3
                className="text-xl font-bold text-text mt-4 mb-2"
                {...props}
              />
            ),
            p: ({ node: _node, ...props }) => (
              <p className="text-subtext1 mb-4 leading-relaxed" {...props} />
            ),
            ul: ({ node: _node, ...props }) => (
              <ul
                className="list-disc list-inside text-subtext1 mb-4 space-y-1"
                {...props}
              />
            ),
            ol: ({ node: _node, ...props }) => (
              <ol
                className="list-decimal list-inside text-subtext1 mb-4 space-y-1"
                {...props}
              />
            ),
            li: ({ node: _node, ...props }) => (
              <li className="text-subtext1" {...props} />
            ),
            code: ({ node: _node, ...props }) => (
              <code
                className="bg-surface0 text-pink px-2 py-1 rounded font-mono text-sm"
                {...props}
              />
            ),
            pre: ({ node: _node, ...props }) => (
              <pre
                className="bg-surface0 p-4 rounded-lg mb-4 overflow-x-auto border border-overlay0"
                {...props}
              />
            ),
            blockquote: ({ node: _node, ...props }) => (
              <blockquote
                className="border-l-4 border-blue pl-4 italic text-subtext1 my-4"
                {...props}
              />
            ),
            a: ({ node: _node, ...props }) => (
              <a
                className="text-blue hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              />
            ),
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      {/* Reaction Button */}
      <div className="flex items-center gap-4 pt-4 border-t border-overlay0">
        <ReactionButton
          type="blogPost"
          id={post.id}
          initialCount={post.reactions || { regular: 0, admin: 0 }}
          color={backgroundColor}
          isAdmin={isUserAdmin}
          hasReacted={hasReacted}
        />
      </div>
    </Card>
  );
}
