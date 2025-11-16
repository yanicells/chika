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

export default async function NoteList({
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} isUserAdmin={isUserAdmin} />
        ))}
      </div>
    </div>
  );
}
