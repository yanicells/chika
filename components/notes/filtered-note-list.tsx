"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Note } from "@/db/schema";
import NoteCard from "./note-card";
import { FilterType } from "./note-filter";
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
    commentCount?: number;
  })[];
  isUserAdmin?: boolean;
  initialFilter?: FilterType;
}

export default function FilteredNoteList({
  notes,
  isUserAdmin = false,
  initialFilter = "all",
}: FilteredNoteListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeFilter =
    (searchParams.get("filter") as FilterType) || initialFilter || "all";

  const handleFilterChange = (filter: FilterType) => {
    const params = new URLSearchParams(searchParams.toString());
    if (filter === "all") {
      params.delete("filter");
    } else {
      params.set("filter", filter);
    }
    // Reset to page 1 when filter changes
    params.delete("page");
    router.push(`/notes?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-text mb-2">Notes</h1>
        <div className="flex items-center justify-between">
          <p className="text-lg text-subtext1">Chika&apos;s people have sent</p>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm bg-surface0 border-2 border-overlay0 rounded-lg text-text hover:border-subtext0 focus:outline-none focus:border-blue cursor-pointer"
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
                onSelect={() => handleFilterChange("all")}
                className="text-sm text-text hover:bg-blue hover:text-base focus:bg-blue focus:text-base cursor-pointer"
              >
                All Notes
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => handleFilterChange("pinned")}
                className="text-sm text-text hover:bg-blue hover:text-base focus:bg-blue focus:text-base cursor-pointer"
              >
                Pinned
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => handleFilterChange("admin")}
                className="text-sm text-text hover:bg-blue hover:text-base focus:bg-blue focus:text-base cursor-pointer"
              >
                Yanicells
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => handleFilterChange("username")}
                className="text-sm text-text hover:bg-blue hover:text-base focus:bg-blue focus:text-base cursor-pointer"
              >
                Not Anonymous
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => handleFilterChange("anonymous")}
                className="text-sm text-text hover:bg-blue hover:text-base focus:bg-blue focus:text-base cursor-pointer"
              >
                Anonymous
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-subtext0 text-lg">
            {activeFilter === "all"
              ? "No notes yet. Be the first to share!"
              : "No notes found with the selected filter."}
          </p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-0">
          {notes.map((note) => (
            <div key={note.id} className="break-inside-avoid mb-6">
              <NoteCard note={note} isUserAdmin={isUserAdmin} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
