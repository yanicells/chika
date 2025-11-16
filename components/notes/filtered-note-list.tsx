"use client";

import { useState, useMemo } from "react";
import { Note } from "@/db/schema";
import NoteCard from "./note-card";
import { FilterType } from "./note-filter";
import Link from "next/link";
import Button from "@/components/ui/button";

interface FilteredNoteListProps {
  notes: (Note & {
    reactions?: {
      regular: number;
      admin: number;
    };
  })[];
  isUserAdmin?: boolean;
}

export default function FilteredNoteList({
  notes,
  isUserAdmin = false,
}: FilteredNoteListProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filteredNotes = useMemo(() => {
    switch (activeFilter) {
      case "admin":
        return notes.filter((note) => note.isAdmin);
      case "username":
        return notes.filter(
          (note) => note.userName && note.userName.trim() !== ""
        );
      case "anonymous":
        return notes.filter(
          (note) => !note.userName || note.userName.trim() === ""
        );
      case "pinned":
        return notes.filter((note) => note.isPinned);
      default:
        return notes;
    }
  }, [notes, activeFilter]);

  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-subtext0 text-lg">
          No notes yet. Be the first to share!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/create">
          <Button variant="primary">✍️ Send Note</Button>
        </Link>

        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value as FilterType)}
          className="px-4 py-2 bg-surface0 border border-overlay0 rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-blue transition-colors"
        >
          <option value="all">All Notes</option>
          <option value="pinned">Pinned</option>
          <option value="admin">Yanicells</option>
          <option value="username">Not Anonymous</option>
          <option value="anonymous">Anonymous</option>
        </select>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-subtext0 text-lg">
            No notes found with the selected filter.
          </p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-0">
          {filteredNotes.map((note) => (
            <div key={note.id} className="break-inside-avoid mb-6">
              <NoteCard note={note} isUserAdmin={isUserAdmin} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
