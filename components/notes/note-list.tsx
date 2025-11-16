import { Note } from "@/db/schema";
import NoteCard from "./note-card";
import Link from "next/link";
import Button from "@/components/ui/button";

interface NoteListProps {
  notes: (Note & {
    reactions?: {
      regular: number;
      admin: number;
    };
  })[];
  isUserAdmin?: boolean;
}

export default function NoteList({
  notes,
  isUserAdmin = false,
}: NoteListProps) {
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
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-0">
        {notes.map((note) => (
          <div key={note.id} className="break-inside-avoid mb-6">
            <NoteCard note={note} isUserAdmin={isUserAdmin} />
          </div>
        ))}
      </div>
    </div>
  );
}
