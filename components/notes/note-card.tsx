"use client";

import Link from "next/link";
import { Note } from "@/db/schema";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import ReactionDisplay from "@/components/reactions/reaction-display";
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {note.title}
          </h3>
        )}

        <p className="text-gray-700 mb-3 line-clamp-3">{truncatedContent}</p>

        {note.imageUrl && (
          <div className="mb-3">
            <img
              src={note.imageUrl}
              alt={note.title || "Note image"}
              className="w-full h-48 object-cover rounded-md"
            />
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <span>By {displayName}</span>
          <span>{new Date(note.createdAt).toLocaleDateString()}</span>
        </div>

        {note.reactions && (
          <div className="mb-3">
            <ReactionDisplay reactions={note.reactions} />
          </div>
        )}
      </div>

      <div className="mt-auto pt-3 border-t border-gray-200">
        <Link href={`/notes/${note.id}`}>
          <Button variant="secondary" size="sm" className="w-full">
            Read More
          </Button>
        </Link>
        <div>{isUserAdmin && <EditButton type="note" id={note.id} />}</div>
      </div>
    </Card>
  );
}
