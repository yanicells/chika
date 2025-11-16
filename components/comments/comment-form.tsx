"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import {
  createNoteComment,
  createBlogComment,
} from "@/lib/actions/comments-actions";
import ImageUpload from "../ui/image-upload";
import CatppuccinColorPicker from "../ui/catppuccin-color-picker";

interface CommentFormProps {
  noteId?: string;
  blogPostId?: string;
}

export default function CommentForm({ noteId, blogPostId }: CommentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    content: "",
    imageUrl: "",
    color: "#89b4fa",
    isPrivate: false,
  });

  if (!noteId && !blogPostId) {
    return (
      <Card>
        <p className="text-red">
          Error: Either noteId or blogPostId is required
        </p>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    if (!formData.content.trim()) {
      setError("Content is required");
      setIsLoading(false);
      return;
    }

    try {
      const result = noteId
        ? await createNoteComment({
            noteId,
            content: formData.content,
            userName: formData.userName || undefined,
            imageUrl: formData.imageUrl || undefined,
            color: formData.color,
            isPrivate: formData.isPrivate,
          })
        : await createBlogComment({
            blogPostId: blogPostId!,
            content: formData.content,
            userName: formData.userName || undefined,
            imageUrl: formData.imageUrl || undefined,
            color: formData.color,
            isPrivate: formData.isPrivate,
          });

      if (result.success) {
        setSuccess(true);
        setFormData({
          userName: "",
          content: "",
          imageUrl: "",
          color: "#89b4fa",
          isPrivate: false,
        });
        router.refresh();
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setError(result.error || "Failed to create comment");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Comment form error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-text mb-4">Add a Comment</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Your Name (optional)"
          type="text"
          value={formData.userName}
          onChange={(e) =>
            setFormData({ ...formData, userName: e.target.value })
          }
          placeholder="Anonymous"
        />

        <Textarea
          label="Comment *"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          placeholder="Write your comment here..."
          rows={4}
          required
        />

        <ImageUpload
          value={formData.imageUrl}
          onChange={(url) => setFormData({ ...formData, imageUrl: url })}
          disabled={isLoading}
        />

        <CatppuccinColorPicker
          value={formData.color}
          onChange={(color) => setFormData({ ...formData, color })}
        />

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPrivate"
            checked={formData.isPrivate}
            onChange={(e) =>
              setFormData({ ...formData, isPrivate: e.target.checked })
            }
            className="h-4 w-4 accent-blue rounded"
          />
          <label htmlFor="isPrivate" className="ml-2 text-sm text-text">
            Make this comment private (admin only)
          </label>
        </div>

        {error && (
          <div className="p-3 bg-red/10 border border-red rounded-md">
            <p className="text-sm text-red">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green/10 border border-green rounded-md">
            <p className="text-sm text-green">Comment added successfully!</p>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          className="w-full"
        >
          Post Comment
        </Button>
      </form>
    </Card>
  );
}
