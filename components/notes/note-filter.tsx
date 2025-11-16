"use client";

import { useState } from "react";
import Badge from "@/components/ui/badge";

export type FilterType = "all" | "admin" | "username" | "anonymous" | "pinned";

interface NoteFilterProps {
  onFilterChange: (filter: FilterType) => void;
  activeFilter: FilterType;
}

export default function NoteFilter({
  onFilterChange,
  activeFilter,
}: NoteFilterProps) {
  const filters: { value: FilterType; label: string }[] = [
    { value: "all", label: "All" },
    { value: "admin", label: "Yanicells" },
    { value: "username", label: "With Username" },
    { value: "anonymous", label: "Anonymous" },
    { value: "pinned", label: "Pinned" },
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-6">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeFilter === filter.value
              ? "bg-blue text-base"
              : "bg-surface1 text-subtext1 hover:bg-surface2"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
