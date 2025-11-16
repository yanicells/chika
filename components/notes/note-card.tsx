"use client";

import Link from "next/link";
import { Note } from "@/db/schema";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import ReactionDisplay from "@/components/reactions/reaction-display";
import ReactionButton from "@/components/reactions/reaction-button";
import AdminBadge from "@/components/admin/admin-badge";
import EditButton from "@/components/ui/edit-button";

interface NoteCardProps {
  note: Note & {
    reactions?: {
      regular: number;
      admin: number;
    };
  };
  isUserAdmin?: boolean;
}

export default function NoteCard({ note, isUserAdmin = false }: NoteCardProps) {
  const truncatedContent =
    note.content.length > 150
      ? `${note.content.substring(0, 150)}...`
      : note.content;

  const displayName = note.userName || "Anonymous";
  const backgroundColor = note.color || "#ffffff";

  return (
    <Card className="h-full flex flex-col" style={{ backgroundColor }}>
      <Link href={`/notes/${note.id}`} className="flex-1">
        <div className="flex-1">
          {note.isPinned && (
            <div className="mb-2">
              <Badge variant="warning" size="sm">
                📌 Pinned
              </Badge>
            </div>
          )}

          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex flex-wrap items-center gap-2">
              {note.isAdmin && <AdminBadge />}
              {note.isPrivate && (
                <Badge variant="default" size="sm">
                  🔒 Private
                </Badge>
              )}
            </div>
          </div>

          {note.title && (
            <h3 className="text-lg font-semibold text-text mb-2 hover:text-blue transition-colors">
              {note.title}
            </h3>
          )}

          {note.imageUrl && (
            <div className="mb-3">
              <img
                src={note.imageUrl}
                alt={note.title || "Note image"}
                className="w-full h-48 object-cover rounded-md"
              />
            </div>
          )}

          <p className="text-subtext1 mb-3 line-clamp-3">{truncatedContent}</p>

          <div className="flex items-center justify-between text-sm text-subtext0 mb-3 font-mono">
            <span>By {displayName}</span>
            <span>{new Date(note.createdAt).toLocaleDateString()}</span>
          </div>

          {note.reactions && (
            <div className="mb-3 flex items-center gap-3">
              <ReactionDisplay reactions={note.reactions} />
              <ReactionButton type="note" id={note.id} hasReacted={false} />
            </div>
          )}
        </div>
      </Link>

      {isUserAdmin && (
        <div className="mt-auto pt-3 border-t border-overlay0">
          <EditButton type="note" id={note.id} />
        </div>
      )}
    </Card>
  );
}
