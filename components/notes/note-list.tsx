import { Note } from "@/db/schema";
import NoteCard from "./note-card";

interface NoteListProps {
  notes: (Note & {
    reactions?: {
      regular: number;
      admin: number;
    };
    commentCount?: number;
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
        <p className="text-subtext0 text-lg">
          No notes yet. Be the first to share!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
