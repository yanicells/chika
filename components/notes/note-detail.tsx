"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Note } from "@/db/schema";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import AdminBadge from "@/components/admin/admin-badge";
import ReactionButton from "@/components/reactions/reaction-button";

interface NoteDetailProps {
  note: Note & {
    reactions?: {
      regular: number;
      admin: number;
    };
  };
  hasReacted?: boolean;
  isUserAdmin?: boolean;
}

export default function NoteDetail({
  note,
  hasReacted = false,
  isUserAdmin = false,
}: NoteDetailProps) {
  const displayName = note.userName || "Anonymous";
  const backgroundColor = note.color || "#ffffff";

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
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {note.isPinned && (
              <Badge
                variant="warning"
                size="sm"
                className="flex items-center gap-1"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                Pinned
              </Badge>
            )}
            {note.isAdmin && <AdminBadge />}
            {note.isPrivate && (
              <Badge
                variant="default"
                size="sm"
                className="flex items-center gap-1"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Private
              </Badge>
            )}
          </div>
          {isUserAdmin && (
            <Link href={`/admin/notes/edit/${note.id}`}>
              <Button variant="secondary" size="sm">
                Edit
              </Button>
            </Link>
          )}
        </div>

        {note.title && (
          <h1 className="text-4xl font-bold text-text -mt-8 -pt-8">
            {note.title}
          </h1>
        )}

        {note.imageUrl && (
          <div className="mb-4">
            <img
              src={note.imageUrl}
              alt={note.title || "Note image"}
              className="w-full max-h-96 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Markdown Content */}
        <div
          className={`prose prose-invert max-w-none ${
            !note.title && !note.imageUrl ? "-mt-6" : ""
          }`}
        >
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  className="text-3xl font-bold text-text mt-6 mb-4"
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className="text-2xl font-bold text-text mt-5 mb-3"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  className="text-xl font-bold text-text mt-4 mb-2"
                  {...props}
                />
              ),
              p: ({ node, ...props }) => (
                <p className="text-subtext1 mb-4 leading-relaxed" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul
                  className="list-disc list-inside text-subtext1 mb-4 space-y-1"
                  {...props}
                />
              ),
              ol: ({ node, ...props }) => (
                <ol
                  className="list-decimal list-inside text-subtext1 mb-4 space-y-1"
                  {...props}
                />
              ),
              li: ({ node, ...props }) => (
                <li className="text-subtext1" {...props} />
              ),
              code: ({ node, ...props }) => (
                <code
                  className="bg-surface0 text-pink px-2 py-1 rounded font-mono text-sm"
                  {...props}
                />
              ),
              pre: ({ node, ...props }) => (
                <pre
                  className="bg-surface0 p-4 rounded-lg mb-4 overflow-x-auto border border-overlay0"
                  {...props}
                />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 border-blue pl-4 italic text-subtext1 my-4"
                  {...props}
                />
              ),
              a: ({ node, ...props }) => (
                <a
                  className="text-blue hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
            }}
          >
            {note.content}
          </ReactMarkdown>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-overlay0">
          <div className="text-sm text-subtext0 font-mono">
            <span>
              {displayName} | {new Date(note.createdAt).toLocaleDateString()}
            </span>
          </div>
          {note.reactions && (
            <div className="flex items-center gap-3">
              <ReactionButton
                type="note"
                id={note.id}
                initialCount={note.reactions}
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
