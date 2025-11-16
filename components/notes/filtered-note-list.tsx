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
          <Button variant="primary">+ Send Note</Button>
        </Link>

        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value as FilterType)}
          className="px-4 py-2 bg-surface0 border-2 border-overlay0 rounded-lg text-text focus:outline-none focus:border-blue hover:border-subtext0 transition-colors cursor-pointer appearance-none bg-no-repeat bg-right pr-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236c7086'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundSize: "1.5rem",
            backgroundPosition: "right 0.5rem center",
          }}
        >
          <option value="all" className="bg-surface0 text-text">
            All Notes
          </option>
          <option value="pinned" className="bg-surface0 text-text">
            Pinned
          </option>
          <option value="admin" className="bg-surface0 text-text">
            Yanicells
          </option>
          <option value="username" className="bg-surface0 text-text">
            Not Anonymous
          </option>
          <option value="anonymous" className="bg-surface0 text-text">
            Anonymous
          </option>
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
