"use client";

import { useState } from "react";
import { Note } from "@/db/schema";
import NoteList from "./note-list";
import Button from "@/components/ui/button";

interface AdminNotesProps {
  initialNotes: Note[];
}

export default function AdminNotes({ initialNotes }: AdminNotesProps) {
  const [showPrivate, setShowPrivate] = useState(true);

  const filteredNotes = initialNotes.filter((note) =>
    showPrivate ? note.isPrivate : !note.isPrivate
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-4">
        <Button
          variant={showPrivate ? "primary" : "secondary"}
          onClick={() => setShowPrivate(true)}
        >
          Private Notes
        </Button>
        <Button
          variant={!showPrivate ? "primary" : "secondary"}
          onClick={() => setShowPrivate(false)}
        >
          Public Notes
        </Button>
      </div>
      <NoteList notes={filteredNotes} isUserAdmin={true} />
    </div>
  );
}
