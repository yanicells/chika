"use client";

import { Note } from "@/db/schema";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import AdminBadge from "@/components/admin/admin-badge";
import ReactionDisplay from "@/components/reactions/reaction-display";
import ReactionButton from "@/components/reactions/reaction-button";
import EditButton from "@/components/ui/edit-button";

interface NoteDetailProps {
  note: Note & {
    reactions?: {
      regular: number;
      admin: number;
    };
  };
  hasReacted?: boolean;
  isAdmin: boolean;
}

export default function NoteDetail({
  note,
  hasReacted = false,
  isAdmin,
}: NoteDetailProps) {
  const displayName = note.userName || "Anonymous";
  const backgroundColor = note.color || "#ffffff";

  return (
    <Card
      className="max-w-6xl mx-auto border-t-4 relative transition-shadow duration-200"
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
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
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
        </div>

        {note.title && (
          <h1 className="text-3xl font-bold text-text">{note.title}</h1>
        )}

        {note.imageUrl && (
          <div>
            <img
              src={note.imageUrl}
              alt={note.title || "Note image"}
              className="w-full max-h-96 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="prose max-w-none">
          <p className="text-subtext1 whitespace-pre-wrap leading-relaxed">
            {note.content}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-subtext0 pt-4 border-t border-overlay0 font-mono">
          <span>By {displayName}</span>
          <div className="flex flex-col items-end gap-1">
            <span>
              Created: {new Date(note.createdAt).toLocaleDateString()}
            </span>
            {note.updatedAt &&
              note.updatedAt.getTime() !== note.createdAt.getTime() && (
                <span>
                  Updated: {new Date(note.updatedAt).toLocaleDateString()}
                </span>
              )}
          </div>
        </div>
        <div>{isAdmin && <EditButton type="note" id={note.id} />}</div>

        <div className="flex items-center gap-4 pt-4 border-t border-overlay0">
          {note.reactions && (
            <>
              <ReactionDisplay reactions={note.reactions} />
              <ReactionButton
                type="note"
                id={note.id}
                hasReacted={hasReacted}
              />
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
