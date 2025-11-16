import { Note } from '@/db/schema';
import NoteCard from './note-card';
import { isAdmin } from '@/lib/auth-helper';

interface NoteListProps {
  notes: (Note & {
    reactions?: {
      regular: number;
      admin: number;
    };
  })[];
}

export default async function NoteList({ notes }: NoteListProps) {
  const adminStatus = await isAdmin();
  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No notes yet. Be the first to share!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} isAdmin={adminStatus} />
      ))}
    </div>
  );
}

