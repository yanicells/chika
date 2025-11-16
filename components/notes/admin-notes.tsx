"use client";

import { useState, useMemo } from "react";
import { Note } from "@/db/schema";
import NoteList from "./note-list";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";

interface AdminNotesProps {
  initialNotes: (Note & {
    reactions?: {
      regular: number;
      admin: number;
    };
    _count?: {
      comments: number;
    };
  })[];
}

type FilterType = "private" | "public" | "all";

export default function AdminNotes({ initialNotes }: AdminNotesProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("private");

  const filteredNotes = useMemo(() => {
    switch (activeFilter) {
      case "private":
        return initialNotes.filter((note) => note.isPrivate);
      case "public":
        return initialNotes.filter((note) => !note.isPrivate);
      default:
        return initialNotes;
    }
  }, [initialNotes, activeFilter]);

  const stats = useMemo(() => {
    const totalComments = initialNotes.reduce(
      (sum, note) => sum + (note._count?.comments || 0),
      0
    );
    const privateCount = initialNotes.filter((n) => n.isPrivate).length;
    const publicCount = initialNotes.filter((n) => !n.isPrivate).length;

    return {
      totalComments,
      privateCount,
      publicCount,
      totalNotes: initialNotes.length,
    };
  }, [initialNotes]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text">
            {activeFilter === "private" && "Private Notes"}
            {activeFilter === "public" && "Public Notes"}
            {activeFilter === "all" && "All Notes"}
          </h2>
          <p className="text-sm text-subtext1 mt-1">
            {stats.totalComments} total comments across {filteredNotes.length}{" "}
            notes
          </p>
        </div>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface0 border-2 border-overlay0 rounded-lg text-text hover:border-subtext0 focus:outline-none focus:border-blue cursor-pointer"
            >
              {activeFilter === "private" && "Private Notes"}
              {activeFilter === "public" && "Public Notes"}
              {activeFilter === "all" && "All Notes"}
              <ChevronDownIcon className="w-4 h-4 text-overlay0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-surface0 border-2 border-overlay0 rounded-lg z-50 min-w-[160px]"
            align="end"
            sideOffset={8}
          >
            <DropdownMenuItem
              onSelect={() => setActiveFilter("private")}
              className="text-text hover:bg-blue hover:text-base focus:bg-blue focus:text-base cursor-pointer"
            >
              Private Notes
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setActiveFilter("public")}
              className="text-text hover:bg-blue hover:text-base focus:bg-blue focus:text-base cursor-pointer"
            >
              Public Notes
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setActiveFilter("all")}
              className="text-text hover:bg-blue hover:text-base focus:bg-blue focus:text-base cursor-pointer"
            >
              All Notes
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <NoteList notes={filteredNotes} isUserAdmin={true} />
    </div>
  );
}
