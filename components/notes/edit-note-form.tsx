"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  updateNote,
  deleteNote,
  togglePinNote,
} from "@/lib/actions/notes-actions";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Card from "@/components/ui/card";
import type { Note } from "@/db/schema";
import ImageUpload from "../ui/image-upload";

interface EditNoteFormProps {
  note: Note;
}

export default function EditNoteForm({ note }: EditNoteFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: note.title || "",
    content: note.content,
    userName: note.userName || "",
    color: note.color,
    isPrivate: note.isPrivate,
    imageUrl: note.imageUrl || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const result = await updateNote(note.id, {
      title: formData.title || undefined,
      content: formData.content,
      userName: formData.userName || undefined,
      color: formData.color,
      isPrivate: formData.isPrivate,
      imageUrl: formData.imageUrl || undefined,
    });

    setIsLoading(false);

    if (result.success) {
      setSuccess("Note updated successfully!");
      setTimeout(() => router.push("/admin/notes"), 1500);
    } else {
      setError(result.error || "Failed to update note");
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this note? This cannot be undone."
      )
    ) {
      return;
    }

    setIsLoading(true);
    const result = await deleteNote(note.id);
    setIsLoading(false);

    if (result.success) {
      router.push("/admin/notes");
    } else {
      setError(result.error || "Failed to delete note");
    }
  };

  const handleTogglePin = async () => {
    setIsLoading(true);
    const result = await togglePinNote(note.id, !note.isPinned);
    setIsLoading(false);

    if (result.success) {
      router.refresh();
    } else {
      setError(result.error || "Failed to toggle pin");
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md">{error}</div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded-md">
            {success}
          </div>
        )}

        <Input
          label="Title (optional)"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter note title..."
        />

        <Textarea
          label="Content"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          placeholder="Enter note content..."
          required
          rows={6}
        />

        <Input
          label="Name (optional)"
          value={formData.userName}
          onChange={(e) =>
            setFormData({ ...formData, userName: e.target.value })
          }
          placeholder="Leave blank for anonymous"
        />

        <ImageUpload
          value={formData.imageUrl}
          onChange={(url) => setFormData({ ...formData, imageUrl: url })}
          disabled={isLoading}
        />

        <div className="flex items-center gap-2">
          <label htmlFor="color" className="text-sm font-medium">
            Background Color:
          </label>
          <input
            id="color"
            type="color"
            value={formData.color}
            onChange={(e) =>
              setFormData({ ...formData, color: e.target.value })
            }
            className="w-20 h-10 rounded cursor-pointer"
          />
          <span className="text-sm text-gray-600">{formData.color}</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="isPrivate"
            type="checkbox"
            checked={formData.isPrivate}
            onChange={(e) =>
              setFormData({ ...formData, isPrivate: e.target.checked })
            }
            className="w-4 h-4 rounded"
          />
          <label htmlFor="isPrivate" className="text-sm font-medium">
            Private (only visible to admin)
          </label>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            isLoading={isLoading}
          >
            Save Changes
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={handleTogglePin}
            disabled={isLoading}
          >
            {note.isPinned ? "Unpin" : "Pin"} Note
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <div className="flex-1" />

          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            disabled={isLoading}
          >
            Delete Note
          </Button>
        </div>
      </form>
    </Card>
  );
}
