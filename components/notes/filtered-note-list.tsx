"use client";

import { useState, useMemo } from "react";
import { Note } from "@/db/schema";
import NoteCard from "./note-card";
import { FilterType } from "./note-filter";
import Link from "next/link";
import Button from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";

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

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface0 border-2 border-overlay0 rounded-lg text-text hover:border-subtext0 focus:outline-none focus:border-blue cursor-pointer"
            >
              {activeFilter === "all" && "All Notes"}
              {activeFilter === "pinned" && "Pinned"}
              {activeFilter === "admin" && "Yanicells"}
              {activeFilter === "username" && "Not Anonymous"}
              {activeFilter === "anonymous" && "Anonymous"}
              <ChevronDownIcon className="w-4 h-4 text-overlay0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-surface0 border-2 border-overlay0 rounded-lg z-50 min-w-[160px]"
            align="end"
            sideOffset={8}
          >
            <DropdownMenuItem
              onSelect={() => setActiveFilter("all")}
              className="text-text hover:bg-blue hover:text-base focus:bg-blue focus:text-base cursor-pointer"
            >
              All Notes
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setActiveFilter("pinned")}
              className="text-text hover:bg-blue hover:text-base focus:bg-blue focus:text-base cursor-pointer"
            >
              Pinned
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setActiveFilter("admin")}
              className="text-text hover:bg-blue hover:text-base focus:bg-blue focus:text-base cursor-pointer"
            >
              Yanicells
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setActiveFilter("username")}
              className="text-text hover:bg-blue hover:text-base focus:bg-blue focus:text-base cursor-pointer"
            >
              Not Anonymous
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setActiveFilter("anonymous")}
              className="text-text hover:bg-blue hover:text-base focus:bg-blue focus:text-base cursor-pointer"
            >
              Anonymous
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
