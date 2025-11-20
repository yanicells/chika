"use client";

import Link from "next/link";
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
              <Badge variant="warning" size="sm">
                📌 Pinned
              </Badge>
            )}
            {note.isAdmin && <AdminBadge />}
            {note.isPrivate && (
              <Badge variant="default" size="sm">
                🔒 Private
              </Badge>
            )}
          </div>
          {isUserAdmin && (
            <Link href={`/admin/notes/edit/${note.id}`}>
              <Button 
                variant="ghost" 
                size="sm"
                className="bg-base text-text hover:text-blue border border-overlay0 hover:border-blue"
              >
                Edit
              </Button>
            </Link>
          )}
        </div>

        {note.title && (
          <h1 className="text-4xl font-bold text-text -mt-8 -pt-8">{note.title}</h1>
        )}

        {note.imageUrl && (
          <div className={note.title ? "" : "-mt-6"}>
            <img
              src={note.imageUrl}
              alt={note.title || "Note image"}
              className="w-full max-h-96 object-cover rounded-lg"
            />
          </div>
        )}

        <div
          className={`prose max-w-none ${
            !note.title && !note.imageUrl ? "-mt-8" : !note.title ? "-mt-8" : ""
          }`}
        >
          <p className="text-subtext1 whitespace-pre-wrap leading-relaxed">
            {note.content}
          </p>
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
