"use client";

import { useState, useMemo } from "react";
import { Note } from "@/db/schema";
import NoteCard from "./note-card";
import NoteFilter, { FilterType } from "./note-filter";
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
      default:
        return notes;
    }
  }, [notes, activeFilter]);

  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">
          No notes yet. Be the first to share!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <Link href="/create">
          <Button>Send Note</Button>
        </Link>
      </div>

      <NoteFilter
        onFilterChange={setActiveFilter}
        activeFilter={activeFilter}
      />

      {filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
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
